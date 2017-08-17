const querystring = require('querystring');
const http2 = require('http2');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

/**
 * Abstraction over Node.js' http/2 stream
 */
class SubStream {
  /**
   * Creates a new super stream (not an actual stream)
   * @param {Http2Stream} stream
   * @param {string} method - request method
   * @param {object} headers
   * @param {object} [query] - request query
   */
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

  /**
   * Merge response headers
   * @param {object} headers
   * @returns {object} Response Headers
   */
  setResponseHeaders(headers) {
    for (const key in headers) {
      this.responseHeaders[key] = headers[key];
    }
    return this.responseHeaders;
  }

  /**
   * Set statusCode in headers
   * @param {number} statusCode
   */
  setStatus(statusCode) {
    this.responseHeaders[HTTP2_HEADER_STATUS] = statusCode;
  }

  /**
   * Send response
   * @param {object} [headers] - Optional and additional headers
   */
  respond(headers) {
    if (this._hasHeadersSent) return; /** @todo: Log error for resend of headers */

    if (headers) {
      this.stream.respond(this.setResponseHeaders(headers));
    } else {
      this.stream.respond(this.responseHeaders);
    }
    this._hasHeadersSent = true;
  }

  /**
   * End stream with a JSON object
   * @param {object} response
   */
  json(response) {
    this.setResponseHeaders({
      HTTP2_HEADER_CONTENT_TYPE: 'application/json'
    });

    this.end(JSON.stringify(response));
  }

  /**
   * End stream with optional response
   * @param {string|Buffer} [buffer] - Optional buffer
   */
  end(buffer) {
    this.open = false;
    this.stream.end(buffer);
  }
}

module.exports = SubStream;