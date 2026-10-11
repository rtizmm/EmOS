"""Stamp the complete browser module graph; run for every deployment."""
from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
version=sys.argv[1]
if not re.fullmatch(r'[a-zA-Z0-9.-]+',version):raise SystemExit('Invalid release id')
for path in (root/'js').rglob('*.js'):
 text=path.read_text()
 text=re.sub(r"(from\s*['\"])(\.[^'\"?]+\.js)(?:\?v=[^'\"]+)?(['\"])",lambda m:m[1]+m[2]+'?v='+version+m[3],text)
 path.write_text(text)
path=root/'index.html'
text=re.sub(r'(\./(?:js/main\.js|css/main\.css))(?:\?v=[^\x27\"\s]+)?',lambda m:m[1]+'?v='+version,path.read_text())
path.write_text(text)
