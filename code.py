import os
from pathlib import Path
import pathspec

# Konfiguracja
ROOT_DIR = Path('.').resolve()
OUTPUT_FILE = 'output.txt'
ALLOWED_EXTENSIONS = {'.js', '.css', '.html'}

# Wczytaj zasady z .gitignore
gitignore_path = ROOT_DIR / '.gitignore'
if gitignore_path.exists():
    with open(gitignore_path, 'r') as f:
        spec = pathspec.PathSpec.from_lines('gitwildmatch', f.readlines())
else:
    spec = pathspec.PathSpec.from_lines('gitwildmatch', [])

# Zbieranie danych
with open(OUTPUT_FILE, 'w', encoding='utf-8') as out_file:
    for root, _, files in os.walk(ROOT_DIR):
        for name in files:
            filepath = Path(root) / name
            relative_path = filepath.relative_to(ROOT_DIR)

            # Pomijaj zignorowane i niepasujące rozszerzenia
            if spec.match_file(str(relative_path)):
                continue
            if filepath.suffix.lower() not in ALLOWED_EXTENSIONS:
                continue

            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                out_file.write(f"\n--- {relative_path} ---\n")
                out_file.write(content + "\n")
            except Exception as e:
                print(f"⚠️ Błąd przy pliku {filepath}: {e}")
