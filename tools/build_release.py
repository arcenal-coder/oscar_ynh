"""Bundle only explicit deliverables, never the worktree, databases or credentials."""

import hashlib
import tarfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "dist"
VERSION = "1.0.0"


def files_in(path):
    if path.is_file():
        return [path]
    return sorted(p for p in path.rglob("*") if p.is_file() and "__pycache__" not in p.parts)


def main():
    DEST.mkdir(exist_ok=True)
    web_files = files_in(ROOT / "web")
    with zipfile.ZipFile(
        DEST / f"oscar-static-{VERSION}.zip", "w", zipfile.ZIP_DEFLATED
    ) as archive:
        for path in web_files:
            archive.write(path, path.relative_to(ROOT / "web"))
    includes = [
        "manifest.toml",
        "LICENSE",
        "tests.toml",
        "requirements.txt",
        "README.md",
        "CHANGELOG.md",
        "web",
        "server",
        "scripts",
        "conf",
        "doc",
        "docs",
        "tools",
        "tests",
        "package.json",
        "package-lock.json",
        "playwright.config.js",
        "pyproject.toml",
        "requirements-dev.txt",
        "cahier-des-charges.md",
        ".arcenal",
        ".github",
    ]
    with tarfile.open(DEST / f"oscar-yunohost-{VERSION}.tar.gz", "w:gz") as archive:
        for item in includes:
            for path in files_in(ROOT / item):
                relative = path.relative_to(ROOT)
                info = archive.gettarinfo(str(path), arcname=f"oscar/{relative}")
                info.uid = info.gid = 0
                info.uname = info.gname = ""
                info.mode = 0o755 if relative.parts[0] == "scripts" else 0o644
                with path.open("rb") as stream:
                    archive.addfile(info, stream)
    archives = sorted(DEST.glob(f"*-{VERSION}.*"))
    checksums = []
    for path in archives:
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        checksums.append(f"{digest}  {path.name}")
        print(f"{path.relative_to(ROOT)} : {path.stat().st_size:,} octets")
    (DEST / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
    print(f"Client statique non compressé : {sum(p.stat().st_size for p in web_files):,} octets")


if __name__ == "__main__":
    main()
