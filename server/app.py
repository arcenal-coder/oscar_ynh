"""Small same-origin API. Run behind a production WSGI server on loopback."""

import fcntl
import hashlib
import hmac
import os
import re
import secrets
import sqlite3
import time
from contextlib import closing, contextmanager
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urlsplit

import click
from flask import Flask, current_app, jsonify, request, send_from_directory
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.middleware.proxy_fix import ProxyFix

ROOT = Path(__file__).resolve().parent.parent
HAZARDS = (
    "raffinerie-sol",
    "raffinerie-fuite",
    "raffinerie-zone",
    "raffinerie-caisse",
    "raffinerie-lunettes",
    "usine-machine",
    "usine-stock",
    "usine-chariot",
    "usine-panneau",
    "usine-bruit",
)
TOKEN_LIFETIME = 86400


@contextmanager
def connect():
    db = sqlite3.connect(current_app.config["DATABASE"], timeout=10)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA busy_timeout=10000")
    try:
        with db:
            yield db
    finally:
        db.close()


def init_db(app):
    with app.app_context(), connect() as db:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                initials TEXT NOT NULL,
                duration_ms INTEGER NOT NULL,
                created_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS used_runs (
                nonce TEXT PRIMARY KEY,
                expires_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS limits (
                bucket TEXT PRIMARY KEY,
                count INTEGER NOT NULL,
                expires_at INTEGER NOT NULL
            );
        """)


def signer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="oscar-run-v1")


def now():
    return int(current_app.config["CLOCK"]())


def limited(action, maximum, window=3600):
    """Persist bounded counters; no raw IP stored and one hash per window."""
    timestamp = now()
    address = request.remote_addr or "unknown"
    bucket = hmac.new(
        current_app.config["SECRET_KEY"].encode(),
        f"{action}:{address}:{timestamp // window}".encode(),
        hashlib.sha256,
    ).hexdigest()
    with connect() as db:
        db.execute("BEGIN IMMEDIATE")
        db.execute("DELETE FROM limits WHERE expires_at < ?", (timestamp,))
        db.execute("DELETE FROM used_runs WHERE expires_at < ?", (timestamp,))
        db.execute(
            "INSERT INTO limits VALUES (?, 1, ?) ON CONFLICT(bucket) DO UPDATE SET count=count+1",
            (bucket, (timestamp // window + 1) * window),
        )
        count = db.execute("SELECT count FROM limits WHERE bucket=?", (bucket,)).fetchone()[0]
    return count > maximum


def create_app(config=None):
    app = Flask(__name__, static_folder=str(ROOT / "web"), static_url_path="")
    directory = Path(os.environ.get("OSCAR_DATA_DIR", ROOT / "data"))
    app.config.update(
        DATABASE=str(directory / "scores.sqlite3"),
        MAX_CONTENT_LENGTH=8192,
        CLOCK=time.time,
        SECRET_KEY=os.environ.get("OSCAR_SECRET_KEY"),
    )
    if config:
        app.config.update(config)
    directory = Path(app.config["DATABASE"]).parent
    directory.mkdir(parents=True, exist_ok=True, mode=0o700)
    if not app.config["SECRET_KEY"]:
        secret_file = directory / ".secret"
        # Lock creation and read as one operation across concurrent WSGI workers.
        fd = os.open(secret_file, os.O_RDWR | os.O_CREAT, 0o600)
        with os.fdopen(fd, "r+") as stream:
            fcntl.flock(stream.fileno(), fcntl.LOCK_EX)
            secret = stream.read().strip()
            if not secret:
                secret = secrets.token_hex(32)
                stream.write(secret)
                stream.flush()
                os.fsync(stream.fileno())
            app.config["SECRET_KEY"] = secret
        if len(app.config["SECRET_KEY"]) < 32:
            raise RuntimeError("Clé de signature absente ou incomplète.")
    if os.environ.get("OSCAR_TRUST_PROXY") == "1":
        # Enable ONLY behind the supplied loopback Nginx proxy configuration.
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)
    init_db(app)

    @app.before_request
    def protect_api():
        if request.path.startswith("/api/") and request.method == "POST":
            origin = request.headers.get("Origin")
            if origin:
                try:
                    allowed_origin = urlsplit(origin).netloc == request.host
                except ValueError:
                    allowed_origin = False
                if not allowed_origin:
                    return jsonify(error="Origine non autorisée."), 403
            if not request.is_json:
                return jsonify(error="Un document JSON est requis."), 415

    @app.after_request
    def headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self'; style-src 'self'; "
            "img-src 'self' data:; connect-src 'self'; object-src 'none'; "
            "base-uri 'self'; frame-ancestors 'self'; form-action 'self'"
        )
        if request.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify(error="Inscription trop volumineuse."), 413

    @app.errorhandler(400)
    def bad_request(_error):
        return jsonify(error="Données JSON invalides."), 400

    @app.get("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    @app.get("/api/health")
    def health():
        with connect() as db:
            db.execute("SELECT 1 FROM scores LIMIT 1").fetchall()
        return jsonify(status="ok", version="1.0.0")

    @app.post("/api/runs")
    def begin_run():
        if limited("runs", 30):
            return jsonify(error="Trop de départs de mission. Réessayez dans une heure."), 429
        token = signer().dumps({"nonce": secrets.token_hex(16), "started": now()})
        return jsonify(token=token), 201

    @app.get("/api/scores")
    def scores():
        with connect() as db:
            rows = db.execute(
                "SELECT id, initials, duration_ms, created_at FROM scores ORDER BY id DESC LIMIT 20"
            ).fetchall()
        return jsonify(
            scores=[
                {
                    "id": row["id"],
                    "initials": row["initials"],
                    "secured": 10,
                    "duration_ms": row["duration_ms"],
                    "created_at": datetime.fromtimestamp(row["created_at"], UTC).isoformat(),
                }
                for row in rows
            ]
        )

    @app.post("/api/scores")
    def submit():
        if limited("submit", 12):
            return jsonify(error="Trop d’envois. Réessayez dans une heure."), 429
        body = request.get_json()
        if not isinstance(body, dict):
            return jsonify(error="Inscription invalide."), 400
        initials = body.get("initials")
        duration = body.get("duration_ms")
        if not isinstance(initials, str) or not re.fullmatch(r"[A-Z]{3}", initials):
            return jsonify(error="Choisissez exactement trois lettres de A à Z."), 400
        if type(duration) is not int or not 60000 <= duration <= TOKEN_LIFETIME * 1000:
            return jsonify(error="Durée de mission incohérente."), 400
        try:
            token = body.get("token")
            if not isinstance(token, str) or len(token) > 512:
                raise BadSignature("invalid token")
            run = signer().loads(token, max_age=TOKEN_LIFETIME)
        except (BadSignature, SignatureExpired):
            return jsonify(error="Cette partie est inconnue ou a expiré. Vous pouvez rejouer."), 400
        if duration > (now() - run["started"] + 2) * 1000:
            return jsonify(error="Le temps de partie ne correspond pas à la mission."), 400
        trace = body.get("trace")
        if not isinstance(trace, list) or len(trace) != 10:
            return jsonify(error="La mission doit comporter dix sécurisations."), 400
        previous, seen = -1, set()
        for index, event in enumerate(trace):
            allowed = HAZARDS[:5] if index < 5 else HAZARDS[5:]
            if not isinstance(event, dict):
                return jsonify(error="Journal de mission invalide."), 400
            hazard_id, at = event.get("id"), event.get("at")
            if (
                not isinstance(hazard_id, str)
                or hazard_id not in allowed
                or hazard_id in seen
                or type(at) is not int
                or at < previous + 1000
                or at > duration
            ):
                return jsonify(error="Ordre ou contenu de mission incohérent."), 400
            seen.add(hazard_id)
            previous = at
        with connect() as db:
            db.execute("BEGIN IMMEDIATE")
            exists = db.execute("SELECT 1 FROM used_runs WHERE nonce=?", (run["nonce"],)).fetchone()
            if exists:
                return jsonify(ok=True, duplicate=True), 200
            db.execute(
                "INSERT INTO used_runs VALUES (?, ?)",
                (run["nonce"], run["started"] + TOKEN_LIFETIME),
            )
            db.execute(
                "INSERT INTO scores(initials, duration_ms, created_at) VALUES (?, ?, ?)",
                (initials, duration, now()),
            )
            db.execute(
                "DELETE FROM scores WHERE id NOT IN (SELECT id FROM scores ORDER BY id DESC LIMIT 20)"
            )
        return jsonify(ok=True, duplicate=False), 201

    @app.cli.command("scores-list")
    def list_scores():
        """List IDs for local administration (not a public endpoint)."""
        with connect() as db:
            for row in db.execute("SELECT * FROM scores ORDER BY id DESC"):
                click.echo(f"{row['id']}\t{row['initials']}\t{row['duration_ms']} ms")

    @app.cli.command("scores-delete")
    @click.argument("score_id", type=int)
    def delete_score(score_id):
        """Remove one inscription by ID."""
        with connect() as db:
            result = db.execute("DELETE FROM scores WHERE id=?", (score_id,))
        if not result.rowcount:
            raise click.ClickException("Inscription introuvable.")
        click.echo("Inscription retirée.")

    @app.cli.command("backup-db")
    @click.argument("destination", type=click.Path())
    def backup_db(destination):
        """Produce a consistent SQLite snapshot, including committed WAL pages."""
        with connect() as source, closing(sqlite3.connect(destination)) as target:
            source.backup(target)
        click.echo("Copie cohérente de la base créée.")

    return app
