class FakeStream {
  constructor() {
    this._calls = [];
    this._responses = [];
  }

  respond(headers) {
    this._calls.push(["respond", headers[':status'], headers]);
    this._responses.push({
      status: headers[':status'],
      headers
    });
  }

  end(chunk) {
    this._calls.push(["end", chunk]);
  }

  lastChunk() {
    return this._calls[this._calls.length - 1][1];
  }

  lastResponse() {
    return this._responses[this._responses.length - 1];
  }

  lastResponseStatus() {
    return this.lastResponse().status;
  }

  lastHeaders() {
    return this.lastResponse().headers;
  }
}

module.exports = FakeStream;