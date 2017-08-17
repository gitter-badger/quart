const querystring = require('querystring');
const http2 = require('http2');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

class SuperStream {
  constructor(stream, method, headers, query) {
    this.stream = stream;
    this.headers = headers;
    this.method = method;
    this.query = querystring.parse(query || '') || {};
    this.open = true;
    this._hasHeadersSent = false;
    this.responseHeaders = {
      HTTP2_HEADER_CONTENT_TYPE: 'text/plain',
      HTTP2_HEADER_STATUS: 200
    };
  }

  setResponseHeaders(headers) {
    for (const key in headers) {
      this.responseHeaders[key] = headers[key];
    }
    return this.responseHeaders;
  }

  setStatus(statusCode) {
    this.responseHeaders[HTTP2_HEADER_STATUS] = statusCode;
  }

  respond(headers) {
    if (this._hasHeadersSent) return; /** @todo: Log error for resend of headers */

    if (headers) {
      this.stream.respond(this.setResponseHeaders(headers));
    } else {
      this.stream.respond(this.responseHeaders);
    }
    this._hasHeadersSent = true;
  }

  json(response) {
    this.setResponseHeaders({
      HTTP2_HEADER_CONTENT_TYPE: 'application/json'
    });

    this.end(JSON.stringify(response));
  }

  end(buffer) {
    this.open = false;
    this.stream.end(buffer);
  }
}

module.exports = SuperStream;