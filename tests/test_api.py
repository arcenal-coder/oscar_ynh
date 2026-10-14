"""Nominal, refusal, retention, concurrency and administration checks."""

import sqlite3
import tempfile
import time
import unittest
from concurrent.futures import ThreadPoolExecutor
from contextlib import closing
from pathlib import Path
from unittest.mock import patch

from server.app import HAZARDS, create_app, signer


class ApiTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.clock = 1000000
        self.app = create_app(
            {
                "TESTING": True,
                "DATABASE": str(Path(self.directory.name) / "scores.db"),
                "SECRET_KEY": "test-key-only-not-a-production-secret",
                "CLOCK": lambda: self.clock,
            }
        )
        self.client = self.app.test_client()

    def tearDown(self):
        self.directory.cleanup()

    def payload(self, nonce="one", initials="ABC"):
        with self.app.app_context():
            token = signer().dumps({"nonce": nonce, "started": self.clock - 180})
        return {
            "token": token,
            "initials": initials,
            "duration_ms": 170000,
            "trace": [{"id": name, "at": 10000 + i * 15000} for i, name in enumerate(HAZARDS)],
        }

    def test_nominal_and_idempotent_retry(self):
        self.assertEqual(self.client.post("/api/runs", json={}).status_code, 201)
        payload = self.payload()
        self.assertEqual(self.client.post("/api/scores", json=payload).status_code, 201)
        retry = self.client.post("/api/scores", json=payload)
        self.assertEqual(retry.status_code, 200)
        self.assertTrue(retry.json["duplicate"])
        scores = self.client.get("/api/scores").json["scores"]
        self.assertEqual(len(scores), 1)
        self.assertEqual(scores[0]["initials"], "ABC")
        self.assertEqual(scores[0]["secured"], 10)

    def test_refuses_invalid_content(self):
        cases = [
            {"initials": "<s>"},
            {"initials": "abcd"},
            {"duration_ms": True},
            {"duration_ms": 0},
            {"duration_ms": 999999999},
            {"token": "forged"},
            {"token": []},
            {"trace": []},
        ]
        for changes in cases:
            with self.subTest(changes=changes):
                self.assertEqual(
                    self.client.post("/api/scores", json=self.payload() | changes).status_code,
                    400,
                )
        body = self.payload()
        body["trace"][1] = body["trace"][0]
        self.assertEqual(self.client.post("/api/scores", json=body).status_code, 400)
        self.assertEqual(self.client.get("/api/scores").json["scores"], [])

    def test_future_duration_and_wrong_level(self):
        with self.app.app_context():
            token = signer().dumps({"nonce": "future", "started": self.clock})
        self.assertEqual(
            self.client.post("/api/scores", json=self.payload() | {"token": token}).status_code,
            400,
        )
        body = self.payload()
        body["trace"][0]["id"] = "usine-machine"
        self.assertEqual(self.client.post("/api/scores", json=body).status_code, 400)

    def test_twenty_entries_and_consumed_token_after_eviction(self):
        first = self.payload("0")
        for i in range(25):
            response = self.client.post(
                "/api/scores",
                json=self.payload(str(i)),
                environ_base={"REMOTE_ADDR": f"127.0.0.{i + 1}"},
            )
            self.assertEqual(response.status_code, 201)
        scores = self.client.get("/api/scores").json["scores"]
        self.assertEqual(len(scores), 20)
        self.assertEqual(scores[0]["id"], 25)
        self.assertEqual(scores[-1]["id"], 6)
        retry = self.client.post("/api/scores", json=first)
        self.assertTrue(retry.json["duplicate"])
        self.assertEqual(self.client.get("/api/scores").json["scores"][0]["id"], 25)

    def test_simultaneous_submissions_and_retry(self):
        bodies = [self.payload(str(i)) for i in range(30)]

        def submit(item):
            index, body = item
            with self.app.test_client() as client:
                return client.post(
                    "/api/scores",
                    json=body,
                    environ_base={"REMOTE_ADDR": f"10.0.0.{index + 1}"},
                ).status_code

        with ThreadPoolExecutor(max_workers=6) as pool:
            self.assertTrue(all(code == 201 for code in pool.map(submit, enumerate(bodies))))
        self.assertEqual(len(self.client.get("/api/scores").json["scores"]), 20)
        same = self.payload("simultaneous")
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(sorted(pool.map(submit, [(101, same), (102, same)])), [200, 201])

    def test_rate_origin_size_and_json(self):
        for _ in range(30):
            self.assertEqual(self.client.post("/api/runs", json={}).status_code, 201)
        self.assertEqual(self.client.post("/api/runs", json={}).status_code, 429)
        self.assertEqual(
            self.client.post(
                "/api/scores", json={}, headers={"Origin": "https://elsewhere.invalid"}
            ).status_code,
            403,
        )
        self.assertEqual(self.client.post("/api/scores", data="hello").status_code, 415)
        self.assertEqual(self.client.post("/api/scores", json={"big": "x" * 9000}).status_code, 413)
        self.clock += 3601
        self.assertEqual(self.client.post("/api/runs", json={}).status_code, 201)

    def test_cli_and_consistent_backup(self):
        self.client.post("/api/scores", json=self.payload())
        runner = self.app.test_cli_runner()
        self.assertIn("ABC", runner.invoke(args=["scores-list"]).output)
        target = str(Path(self.directory.name) / "backup.sqlite3")
        self.assertEqual(runner.invoke(args=["backup-db", target]).exit_code, 0)
        with closing(sqlite3.connect(target)) as db:
            self.assertEqual(db.execute("SELECT count(*) FROM scores").fetchone()[0], 1)
        self.assertEqual(runner.invoke(args=["scores-delete", "1"]).exit_code, 0)
        self.assertEqual(self.client.get("/api/scores").json["scores"], [])
        self.assertNotEqual(runner.invoke(args=["scores-delete", "1"]).exit_code, 0)
        self.assertIn(self.client.delete("/api/scores/1").status_code, (404, 405))

    def test_static_security_and_restart(self):
        with self.client.get("/") as response:
            self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get("/.secret").status_code, 404)
        self.assertEqual(self.client.get("/api/health").json["status"], "ok")
        response = self.client.get("/api/scores")
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.assertIn("object-src 'none'", response.headers["Content-Security-Policy"])
        self.client.post("/api/scores", json=self.payload())
        restarted = create_app(self.app.config.copy()).test_client()
        self.assertEqual(len(restarted.get("/api/scores").json["scores"]), 1)

    def test_expired_token_and_non_object_payload(self):
        self.assertEqual(
            self.client.post("/api/runs", json={}, headers={"Origin": "http://["}).status_code, 403
        )
        body = self.payload()
        old_time = time.time() - 90000
        with self.app.app_context(), patch("itsdangerous.timed.time.time", return_value=old_time):
            body["token"] = signer().dumps({"nonce": "expired", "started": self.clock - 180})
        self.assertEqual(self.client.post("/api/scores", json=body).status_code, 400)
        self.assertEqual(self.client.post("/api/scores", json=[]).status_code, 400)
        self.assertEqual(
            self.client.post("/api/scores", data="{", content_type="application/json").status_code,
            400,
        )

    def test_concurrent_startup_keeps_one_private_signing_key(self):
        config = {"DATABASE": self.app.config["DATABASE"], "SECRET_KEY": None, "TESTING": True}
        with ThreadPoolExecutor(max_workers=4) as pool:
            keys = list(pool.map(lambda _: create_app(config).config["SECRET_KEY"], range(4)))
        self.assertEqual(len(set(keys)), 1)
        self.assertEqual(len(keys[0]), 64)
        self.assertEqual((Path(self.directory.name) / ".secret").stat().st_mode & 0o777, 0o600)


if __name__ == "__main__":
    unittest.main()
