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
    this._routeMap.set(this._getRouteString(method, route));
  }

  use(handler) {
    this._middleware.push(handler);
    this._middlewareSet.add(handler);
  }

  routeStream(stream, headers) {
    
  }
}

module.exports = Router;