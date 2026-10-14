"""Check syntax, official manifest schema and bundle boundaries without YunoHost."""

import json
import subprocess
import tomllib
import urllib.request
from pathlib import Path

import jsonschema

ROOT = Path(__file__).resolve().parent.parent
SCHEMA = "https://raw.githubusercontent.com/YunoHost/apps/main/schemas/manifest.v2.schema.json"


def main():
    with urllib.request.urlopen(SCHEMA, timeout=20) as response:
        schema = json.load(response)
    manifest = tomllib.loads((ROOT / "manifest.toml").read_text())
    jsonschema.Draft7Validator(schema).validate(manifest)
    print("Manifeste conforme au schéma officiel YunoHost v2.")
    tomllib.loads((ROOT / "tests.toml").read_text())
    for script in (ROOT / "scripts").iterdir():
        if script.is_file():
            subprocess.run(["bash", "-n", str(script)], check=True)
    print("Scripts de cycle de vie : syntaxe Bash valide.")
    # SQLite and secrets must never be included in the public root.
    forbidden = {".secret", ".env", "scores.sqlite3"}
    assert not any(p.name in forbidden for p in (ROOT / "web").rglob("*"))
    print("Aucun fichier de données ou secret attendu dans le répertoire public.")


if __name__ == "__main__":
    main()
