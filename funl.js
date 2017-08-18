const http2 = require('http2');
const Router = require('./lib/Router');

/**
 * Quart web server
 */
class Quart {
  /**
   * Creates a new Quart instance
   * @param {object} [options] - Options passed to createSecureServer such as `cert` and `key`
   * @param {Http2SecureServer} [instance] - Optional http2 instance to be used instead of creating a brand new one
   */
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

  /**
   * Listen on a path
   * @param {string} path - url/path to map handler to
   * @param {function} handler - an *async* function that accepts a stream object as the first argument
   */
  on(path, handler) {
    this.router.on(path, handler);
  }

  /**
   * Adds a middleware that always executes before listeners
   * @param {function} handler - an *async* function that accepts a stream object as the first argument
   */
  preflight(handler) {
    this.router.preflight(handler);
  }

  /**
   * Adds a postflight middleware that always executes after listeners
   * @param {function} handler - an *async* function that accepts a stream object as the first argument
   */
  postflight(handler) {
    this.router.postflight(handler);
  }

  /**
   * Bind instance to listen on a given port
   * @param {number} port - an open port
   * @param {function} callback
   */
  listen(port, callback) {
    this.server.listen(port, callback);
  }
}

module.exports = Quart;