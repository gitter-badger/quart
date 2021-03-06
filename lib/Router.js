const url = require('url');
const http2 = require('http2');
const MapList = require('./MapList');
const WeakList = require('./WeakList');
const SubStream = require('./SubStream');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

class Router {
  constructor() {
    this._preflights = new WeakList();
    this._postflights = new WeakList();
    this._routeMap = new MapList();
  }

  _HANDLE_404(stream) {
    stream.respond({
      'content-type': 'text/plain',
      [HTTP2_HEADER_STATUS]: 404
    });
    stream.end('Not found');
  }

  createRouteHandler(handler) {
    if (typeof handler === 'function') return handler;
    else {
      return (stream) => {
        if (typeof handler[stream.method.toLowerCase()] === 'function') handler[stream.method.toLowerCase()](stream);
        else this._HANDLE_404(stream);
      };
    }
  }

  on(route, handler) {
    /** @todo: Check if new route overrides existing route */
    this._routeMap.push(route, this.createRouteHandler(handler));
  }

  preflight(handler) {
    this._preflights.push(handler);
  }

  postflight(handler) {
    this._postflights.push(handler);
  }

  async routeStream(stream, headers) {
    const method = headers[HTTP2_HEADER_METHOD];
    const parsed_url = url.parse(headers[HTTP2_HEADER_PATH]);
    const route = parsed_url.pathname;
    const sub_stream = new SubStream(stream, method, headers, parsed_url.query);
    const preflights = this._preflights.length;
    const postflights = this._postflights.length;

    for (let i = 0; i < preflights; i++) {
      await this._preflights.get(i)(sub_stream);
    }

    if (this._routeMap.has(route)) {
      const map = this._routeMap.get(route);
      for (let i = 0; i < map.length; i++) {
        await map[i](sub_stream);
      }

      // Handle postflights
      for (let i = 0; i < postflights; i++) {
        await this._postflights.get(i)(sub_stream);
      }
    } else {
      this._HANDLE_404(sub_stream);
    }
  }
}

module.exports = Router;