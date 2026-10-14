"""Require actual successful lifecycle scenarios, not just a checker exit code."""

import json
import sys
from pathlib import Path

reports = sorted(Path(sys.argv[1]).glob("results_*.json"))
if not reports:
    raise SystemExit("Aucun rapport package_check produit.")
successful = set()
for report in reports:
    data = json.loads(report.read_text())
    if data.get("app") != "oscar":
        raise SystemExit("Le rapport ne concerne pas Oscar.")
    for test in data.get("tests", []):
        if test.get("main_result") not in {"success", "not_applicable"}:
            raise SystemExit(f"Scénario non réussi : {test}")
        if test.get("main_result") == "success":
            successful.add((test.get("test_type"), test.get("test_arg", "")))
required = {
    ("TEST_INSTALL", "root"),
    ("TEST_INSTALL", "subdir"),
    ("TEST_BACKUP_RESTORE", ""),
    ("TEST_UPGRADE", ""),
}
missing = required - successful
if missing:
    raise SystemExit(f"Scénarios de cycle de vie manquants : {sorted(missing)}")
print("Installation racine/sous-chemin, upgrade et backup/restore réellement réussis.")
