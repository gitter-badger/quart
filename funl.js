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

  get(route, handler) {
    this.router.add("GET", route, handler);
  }

  post(route, handler) {
    this.router.add("POST", route, handler);
  }

  put(route, handler) {
    this.router.add("PUT", route, handler);
  }

  delete(route, handler) {
    this.router.add("DELETE", route, handler);
  }

  any(route, handler) {
    this.router.add("ANY", route, handler);
  }

  use(route) {
    this.router.use(handler);
  }

  listen(port) {
    this.server.listen(port);
  }
}

module.exports = FUNL;