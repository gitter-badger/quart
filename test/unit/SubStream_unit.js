const SubStream = requireFromLibrary("SubStream");
const FakeStream = require('../mocks/HTTP2_Stream');

describe('SubStream Unit Tests', function () {
  it('should create a new SubStream', function () {
    const headers = {};
    const stream = new SubStream(new FakeStream(), 'GET', headers);
    expect(stream).to.have.property('method', 'GET');
    expect(stream).to.have.property('open', true);
    expect(stream).to.have.property('headers', headers);
    expect(stream).to.have.property('responseHeaders');
    expect(stream).to.have.property('query');
  });

  it('should have correct initial response headers', function () {
    const stream = new SubStream(new FakeStream(), 'GET', {});
    expect(stream.responseHeaders).to.have.property('content-type', 'text/plain');
    expect(stream.responseHeaders).to.have.property(':status', 200);
  });

  it('should set response headers', function () {
    const stream = new SubStream(new FakeStream(), 'GET');
    expect(stream.responseHeaders).to.have.property('content-type', 'text/plain');
    expect(stream.responseHeaders).to.have.property(':status', 200);
    
    stream.setResponseHeaders({
      'x-created-by': 'test',
      ':status': 404
    });

    expect(stream.responseHeaders).to.have.property('x-created-by', 'test');
    expect(stream.responseHeaders).to.have.property('content-type', 'text/plain');
    expect(stream.responseHeaders).to.have.property(':status', 404);
  });

  it('should update statusCode', function () {
    const stream = new SubStream(new FakeStream(), 'POST');
    expect(stream.responseHeaders).to.have.property(':status', 200);
    
    stream.setStatus(500);
    expect(stream.responseHeaders).to.have.property(':status', 500);
  });

  it('should respond with headers', function () {
    const hstream = new FakeStream();
    const stream = new SubStream(hstream, 'GET');

    stream.respond();

    expect(hstream.lastResponseStatus()).to.equal(200);
  });

  it('should respond only once with headers', function () {
    const hstream = new FakeStream();
    const stream = new SubStream(hstream, 'GET');
    expect(stream.responseHeaders).to.have.property('content-type', 'text/plain');
    expect(stream.responseHeaders).to.have.property(':status', 200);

    stream.respond({
      ':status': 200
    });

    expect(hstream.lastResponseStatus()).to.equal(200);

    stream.respond({
      ':status': 404
    });

    expect(hstream.lastResponseStatus()).to.equal(200);
  });

  it('should end stream with a chunk', function () {
    const hstream = new FakeStream();
    const s1 = new SubStream(hstream, 'GET');
    const s2 = new SubStream(hstream, 'PUT');

    s1.end();
    expect(s1).to.have.property('open', false);
    expect(hstream.lastChunk()).to.be.undefined;

    s2.end("TEST");
    expect(s2).to.have.property('open', false);
    expect(hstream.lastChunk()).to.be.equal("TEST");
  });

  it('should send a json response', function () {
    const hstream = new FakeStream();
    const s1 = new SubStream(hstream, 'GET');
    const response = {
      hello: "test"
    };

    s1.json(response);
    expect(s1).to.have.property('open', false);
    expect(hstream.lastChunk()).to.be.equal(JSON.stringify(response));
    expect(hstream.lastHeaders()).to.have.property('content-type', 'application/json');
  });
});