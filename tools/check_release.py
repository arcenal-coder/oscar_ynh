"""Verify archive integrity and boot the actual extracted delivery, not the worktree."""

import hashlib
import os
import subprocess
import sys
import tarfile
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def main():
    for line in (DIST / "SHA256SUMS").read_text().splitlines():
        expected, name = line.split("  ", 1)
        assert hashlib.sha256((DIST / name).read_bytes()).hexdigest() == expected
    with zipfile.ZipFile(DIST / "oscar-static-1.0.0.zip") as archive:
        assert archive.testzip() is None
        assert "index.html" in archive.namelist()
        assert all(not name.startswith(("server/", "data/", ".")) for name in archive.namelist())
    with tempfile.TemporaryDirectory() as directory:
        with tarfile.open(DIST / "oscar-yunohost-1.0.0.tar.gz") as archive:
            members = archive.getmembers()
            assert all(member.isfile() for member in members)
            for member in members:
                parts = Path(member.name).parts
                assert parts[0] == "oscar"
                assert not {".git", ".venv", ".secret", "data", "node_modules"}.intersection(parts)
            archive.extractall(directory, filter="data")
        source = Path(directory) / "oscar"
        assert os.access(source / "scripts/install", os.X_OK)
        subprocess.run(
            [
                sys.executable,
                "-c",
                "\n".join(
                    [
                        "from server.app import create_app",
                        "app = create_app()",
                        "client = app.test_client()",
                        "with client.get('/') as response:",
                        "    assert response.status_code == 200",
                        "assert client.get('/api/health').json['status'] == 'ok'",
                        "assert client.get('/api/scores').json['scores'] == []",
                        "assert client.post('/api/runs', json={}).status_code == 201",
                        "print('Livraison extraite : accueil, API, base vide et jeton fonctionnels.')",
                    ]
                ),
            ],
            cwd=source,
            env=os.environ | {"OSCAR_DATA_DIR": str(Path(directory) / "isolated-data")},
            check=True,
        )
    print("Archives intègres, empreintes vérifiées, aucun fichier local de données embarqué.")


if __name__ == "__main__":
    main()
