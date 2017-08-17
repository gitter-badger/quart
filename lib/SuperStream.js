const querystring = require('querystring');

class SuperStream {
  constructor(stream, method, headers, query) {
    this.stream = stream;
    this.headers = headers;
    this.method = method;
    this.query = querystring.parse(query || '') || {};
    this._hasHeadersSent = false;
    this.responseHeaders = {
      'content-type': 'text/plain',
      ':status': 200
    };
  }

  setResponseHeaders(headers) {
    for (const key in headers) {
      this.responseHeaders[key] = headers[key];
    }
    return this.responseHeaders;
  }

  setStatus(statusCode) {
    this.responseHeaders[':status'] = statusCode;
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
      'content-type': 'application/json'
    });

    this.stream.end(JSON.stringify(response));
  }

  end(buffer) {
    this.stream.end(buffer);
  }
}

module.exports = SuperStream;