#!/usr/bin/env python3
import os
import sys
import zipfile

def package_target(target_name: str, base_dir: str):
    source_dir = os.path.join(base_dir, "dist", target_name)
    if target_name == "firefox":
        output_zip = os.path.join(base_dir, "dist", "speedyslate-firefox-amo.zip")
    else:
        output_zip = os.path.join(base_dir, "dist", f"speedyslate-{target_name}.zip")

    if not os.path.exists(source_dir):
        print(f"[Error] Directory not found: {source_dir}", file=sys.stderr)
        return False

    if os.path.exists(output_zip):
        os.remove(output_zip)

    print(f"[SpeedySlate] Packaging {source_dir} -> {output_zip} ...")
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)

    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"✓ Package completed: {output_zip} ({size_mb:.2f} MB)")
    if target_name == "firefox":
        print(f"👉 File sẵn sàng nộp lên Mozilla Add-ons (AMO): {output_zip}")
    else:
        print(f"👉 File zip cho {target_name.title()}: {output_zip}")
    return True

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target = sys.argv[1] if len(sys.argv) > 1 else "all"

    if target in ("firefox", "chrome"):
        success = package_target(target, base_dir)
        sys.exit(0 if success else 1)
    elif target in ("all", "both"):
        success_chrome = package_target("chrome", base_dir)
        success_ff = package_target("firefox", base_dir)
        sys.exit(0 if (success_chrome and success_ff) else 1)
    else:
        print(f"[Error] Unknown target: {target}. Use 'chrome', 'firefox', or 'all'.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
