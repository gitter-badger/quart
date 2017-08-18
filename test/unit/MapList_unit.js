const MapList = requireFromLibrary("MapList");

describe('MapList Unit Tests', function () {
  it('should create a new MapList', function () {
    const list = new MapList();
  });

  it('should not throw or return on an empty MapList', function () {
    const list = new MapList();
    expect(list.size()).to.be.undefined;
    expect(list.has('key')).to.be.equal(false);
    expect(list.get('key')).to.be.undefined;
    expect(list.hasItem('key', 'value')).to.be.equal(false);
    expect(list.copy()).to.be.undefined;
    expect(list.pop()).to.be.undefined;
    expect(list.shift()).to.be.undefined;
  });

  it('should push to list', function () {
    const list = new MapList();
    list.push("test", "hello", "world");
    expect(list.has("test")).to.be.true;
    expect(list.size("test")).to.be.equal(2);
    expect(list.hasItem("test", "hello")).to.be.true;
    expect(list.hasItem("test", "world")).to.be.true;
  });

  it('should unshift to list', function () {
    const list = new MapList();
    list.unshift("test", "hello", "world");
    expect(list.has("test")).to.be.true;
    expect(list.size("test")).to.be.equal(2);
    expect(list.get("test")).to.be.eql(["hello", "world"]);
    expect(list.hasItem("test", "hello")).to.be.true;
    expect(list.hasItem("test", "world")).to.be.true;
  });

  it('should add items in the correct orders', function () {
    const list = new MapList();
    list.push("test", "hello", "world");
    expect(list.has("test")).to.be.true;
    expect(list.get("test")).to.be.eql(["hello", "world"]);
    expect(list.size("test")).to.be.equal(2);

    list.unshift("test", "first");
    list.push("test", "last");
    expect(list.get("test")).to.be.eql(["first", "hello", "world", "last"]);
  });

  it('should pop and shift items', function () {
    const list = new MapList();
    list.push("test", "hello", "world");
    list.unshift("test", "first");
    list.push("test", "last");

    expect(list.size("test")).to.be.equal(4);
    expect(list.pop("test")).to.be.equal("last");
    expect(list.size("test")).to.be.equal(3);
    expect(list.pop("test")).to.be.equal("world");
    expect(list.get("test")).to.be.eql(["first", "hello"]);
    expect(list.shift("test")).to.be.equal("first");
    expect(list.size("test")).to.be.equal(1);
  });

  it('should copy list to array', function () {
    const list = new MapList();
    list.push("test", "hello", "world");
    list.unshift("test", "first");
    list.push("test", "last");

    const alist = list.get("test");
    const blist = list.copy("test");
    expect(alist).to.not.be.equal(blist);
  });
});