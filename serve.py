#!/usr/bin/env python3
"""
Local dev server for testing the production build.
Build first with: npm run build
Then run:        python serve.py
Opens at:        http://localhost:8080
"""

import http.server
import os
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIST = Path(__file__).parent / "dist"


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    """Serve from dist/; fall back to index.html for unknown paths (SPA routing)."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self):
        # Strip query string for file-existence check
        path = self.path.split("?")[0].split("#")[0]
        target = DIST / path.lstrip("/")
        if not target.exists() or target.is_dir() and not (target / "index.html").exists():
            # Serve the SPA shell for any unknown path
            self.path = "/index.html"
        super().do_GET()

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} — {fmt % args}")


if __name__ == "__main__":
    if not DIST.exists():
        print("ERROR: dist/ not found. Run 'npm run build' first.")
        sys.exit(1)

    print(f"Serving {DIST} at http://localhost:{PORT}")
    print("Press Ctrl+C to stop.\n")
    with http.server.HTTPServer(("", PORT), SPAHandler) as server:
        server.serve_forever()
