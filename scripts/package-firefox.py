#!/usr/bin/env python3
import os
import zipfile
import sys

def package():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_dir = os.path.join(base_dir, "dist", "firefox")
    output_zip = os.path.join(base_dir, "dist", "speedyslate-firefox-amo.zip")

    if not os.path.exists(source_dir):
        print(f"[Error] Directory not found: {source_dir}", file=sys.stderr)
        sys.exit(1)

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
    print(f"👉 File sẵn sàng nộp lên Mozilla Add-ons (AMO): {output_zip}")

if __name__ == "__main__":
    package()
