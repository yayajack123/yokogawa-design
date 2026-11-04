"""Preview the static site with its custom 404 page."""

import argparse
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent


class SiteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_error(self, code, message=None, explain=None):
        if code != HTTPStatus.NOT_FOUND:
            return super().send_error(code, message, explain)

        page = (ROOT / '404.html').read_bytes()
        self.send_response(HTTPStatus.NOT_FOUND)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(page)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(page)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('port', nargs='?', type=int, default=8000)
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port), SiteHandler) as server:
        print(f'Preview: http://localhost:{args.port}/', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
