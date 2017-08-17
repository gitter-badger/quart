const http2 = require('http2');
const Router = require('./lib/Router');

class FUNL {
  constructor(options, server) {
    // Store options
    this.options = options;

    // Initialize server or reuse from args
    if (!server) this.server = http2.createSecureServer(options);
    else this.server = server;

    // Create a Router instance
    this.router = new Router();

    // Bind individual streams to Router
    this.server.on('stream', (stream, headers) => this.router.routeStream(stream, headers));
  }

  on(route, handler) {
    this.router.on(route, handler);
  }

  preflight(handler) {
    this.router.preflight(handler);
  }

  postflight(handler) {
    this.router.postflight(handler);
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }
}

module.exports = FUNL;