import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "dist"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print(f"App: በኡስታዝ አቡ ሰልዋ ሁሴን ስዩም ሉምአቱል ኢእቲቃድ")
    httpd.serve_forever()
