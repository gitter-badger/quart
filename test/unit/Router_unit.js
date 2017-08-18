const Router = requireFromLibrary("Router");
const FakeStream = require('../mocks/HTTP2_Stream');

class FakeSubStream extends FakeStream {
  constructor(method, headers, query) {
    super();
    this.method = method;
    this.headers = headers;
    this.query = query;
    this.open = true;
  }
}

describe('Router Unit Tests', function () {
  it('should create a new Router', function () {
    const router = new Router();
  });

  it('should create the correct route handler', function () {
    const router = new Router();
    const functionHandler = () => {};
    let callStack = [];
    const objectHandler = {
      get: () => callStack.push("GET"),
      post: () => callStack.push("POST")
    };
    expect(router).to.have.property("createRouteHandler");
    expect(router.createRouteHandler(functionHandler)).to.be.equal(functionHandler);
    const handler = router.createRouteHandler(objectHandler);
    handler(new FakeSubStream('GET'));
    handler(new FakeSubStream('POST'));

    expect(callStack).to.have.members(["GET", "POST"]);

    const fakePutStream = new FakeSubStream('PUT');

    handler(fakePutStream);
    expect(fakePutStream._calls.pop()).to.have.members(["end", "Not found"])
  });

  it('should add preflight and postflight handlers', function () {
    const router = new Router();
    const handler1 = () => "test";
    const handler2 = () => "test2";

    router.preflight(handler1);
    router.postflight(handler2);
  });

  it('should route on handles', async () => {
    const router = new Router();
    let onHandleCalled = false;
    const handler1 = () => "test";
    const handler2 = () => "test2";
    const onHandle = () => (onHandleCalled = true);
    const stream = new FakeStream();

    router.on('/test', onHandle);

    await router.routeStream(stream, {
      ':method': 'GET',
      ':path': '/test'
    });
    expect(onHandleCalled).to.be.true;
  });

  it('should return 404 when no handles are found', async () => {
    const router = new Router();
    let onHandleCalled = false;
    const onHandle = () => (onHandleCalled = true);
    const stream = new FakeStream();

    router.on('/test', onHandle);

    await router.routeStream(stream, {
      ':method': 'GET',
      ':path': '/'
    });
    expect(onHandleCalled).to.be.false;
    expect(stream.lastResponseStatus()).to.be.equal(404);
  });

  it('should add flight handles', async () => {
    const router = new Router();
    let handleCalls = [];
    const handler1 = () => handleCalls.push(1);
    const handler2 = () => handleCalls.push(2);
    const onHandle = () => handleCalls.push(0);
    const stream = new FakeStream();

    router.preflight(handler1);
    router.on('/test', onHandle);
    router.postflight(handler2);

    await router.routeStream(stream, {
      ':method': 'GET',
      ':path': '/test'
    });
    expect(handleCalls).to.have.members([0, 1, 2]);
  });
});