#!/usr/bin/env python3
"""
SpeedySlate Automatic Version Bumper
Synchronously bumps semantic version across:
- package.json
- manifest.chrome.json
- manifest.firefox.json
- src/popup/popup.html (PRO vX.Y.Z badge)

Usage:
  python3 scripts/bump_version.py          # Bumps patch: 1.1.0 -> 1.1.1
  python3 scripts/bump_version.py minor    # Bumps minor: 1.1.0 -> 1.2.0
  python3 scripts/bump_version.py major    # Bumps major: 1.1.0 -> 2.0.0
  python3 scripts/bump_version.py 1.3.5    # Sets exact version: 1.3.5
"""
import os
import sys
import re
import json

def bump_semver(current: str, bump_type: str = "patch") -> str:
    parts = current.strip().split(".")
    while len(parts) < 3:
        parts.append("0")
    try:
        major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])
    except ValueError:
        print(f"[Warning] Non-standard version format: {current}. Using fallback.", file=sys.stderr)
        return "1.3.0"

    bump_type_clean = bump_type.strip().lower()
    if bump_type_clean == "major":
        return f"{major + 1}.0.0"
    elif bump_type_clean == "minor":
        return f"{major}.{minor + 1}.0"
    elif bump_type_clean == "patch":
        return f"{major}.{minor}.{patch + 1}"
    elif re.match(r"^\d+(\.\d+)*$", bump_type.strip()):
        num_parts = bump_type.strip().split(".")
        while len(num_parts) < 3:
            num_parts.append("0")
        return ".".join(num_parts[:3])
    else:
        print(f"[Warning] Unknown bump type '{bump_type}', defaulting to patch.", file=sys.stderr)
        return f"{major}.{minor}.{patch + 1}"

def update_json_file(file_path: str, new_version: str) -> bool:
    if not os.path.exists(file_path):
        return False
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        data["version"] = new_version
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        return True
    except Exception as e:
        print(f"[Error] Failed to update {file_path}: {e}", file=sys.stderr)
        return False

def update_popup_html(file_path: str, new_version: str) -> bool:
    if not os.path.exists(file_path):
        return False
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Matches e.g. <span class="brand-badge">PRO v1.1.0</span> or <span class="brand-badge">PRO v1.0</span>
        pattern = r'(<span class="brand-badge">PRO v)[^<]+(</span>)'
        replacement = rf'\g<1>{new_version}\g<2>'

        updated = re.sub(pattern, replacement, content)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated)
        return True
    except Exception as e:
        print(f"[Error] Failed to update {file_path}: {e}", file=sys.stderr)
        return False

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pkg_path = os.path.join(base_dir, "package.json")
    chrome_manifest = os.path.join(base_dir, "manifest.chrome.json")
    firefox_manifest = os.path.join(base_dir, "manifest.firefox.json")
    popup_html = os.path.join(base_dir, "src", "popup", "popup.html")

    if not os.path.exists(pkg_path):
        print(f"[Error] package.json not found at {pkg_path}", file=sys.stderr)
        sys.exit(1)

    with open(pkg_path, "r", encoding="utf-8") as f:
        pkg_data = json.load(f)

    current_ver = pkg_data.get("version", "1.0.0")

    if os.environ.get("NO_BUMP") == "1":
        print(f"\n[SpeedySlate] ℹ️ NO_BUMP=1 detected. Keeping version at {current_ver}\n")
        return

    bump_arg = os.environ.get("VERSION") or (sys.argv[1] if len(sys.argv) > 1 else "patch")
    new_ver = bump_semver(current_ver, bump_arg)

    print(f"\n[SpeedySlate] 🚀 Bumping version: {current_ver} ➔ {new_ver}")

    # 1. package.json
    if update_json_file(pkg_path, new_ver):
        print(f"  ✓ package.json ➔ {new_ver}")

    # 2. manifest.chrome.json
    if update_json_file(chrome_manifest, new_ver):
        print(f"  ✓ manifest.chrome.json ➔ {new_ver}")

    # 3. manifest.firefox.json
    if update_json_file(firefox_manifest, new_ver):
        print(f"  ✓ manifest.firefox.json ➔ {new_ver}")

    # 4. src/popup/popup.html
    if update_popup_html(popup_html, new_ver):
        print(f"  ✓ src/popup/popup.html badge ➔ PRO v{new_ver}")

    print(f"[SpeedySlate] ✨ Version synchronization complete!\n")

if __name__ == "__main__":
    main()
