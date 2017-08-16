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
    const path = headers[':path'];
    const route = this._getRouteString(method, path);

    if (this._routeMap.has(route)) {
      this._routeMap.get(route)(stream, headers);
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