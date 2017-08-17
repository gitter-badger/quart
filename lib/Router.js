const SuperStream = require('./SuperStream');
const url = require('url');

class Router {
  constructor() {
    this._middleware = [];
    this._middlewareSet = new WeakSet();
    this._routeMap = new Map();
  }

  _getRouteString(method, route) {
    return `:${method}:${route}`;
  }

  add(method, route, handler) {
    /** @todo: Check if new route overrides existing route */
    this._routeMap.set(this._getRouteString(method, route), handler);
  }

  use(handler) {
    this._middleware.push(handler);
    this._middlewareSet.add(handler);
  }

  routeStream(stream, headers) {
    const method = headers[':method'];
    const parsed_url = url.parse(headers[':path']);
    const route = this._getRouteString(method, parsed_url.pathname);

    if (this._routeMap.has(route)) {
      const superstream = new SuperStream(stream, method, headers, parsed_url.query);
      this._routeMap.get(route)(superstream);
    } else {
      stream.respond({
        'content-type': 'text/plain',
        ':status': 404
      });
      stream.end('Not found');
    }
  }
}

module.exports = Router;