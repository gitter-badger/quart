const WeakList = requireFromLibrary("WeakList");

describe('WeakList Unit Tests', function () {
  const hello = { hello: true };
  const world = { world: true };
  const first = { first: true };
  const second = { second: true };
  const last = { last: true };

  it('should create a new WeakList', function () {
    const list = new WeakList();
  });

  it('should not throw or return on an empty WeakList', function () {
    const list = new WeakList();
    expect(list.length).to.be.equal(0);
    expect(list.has('key')).to.be.equal(false);
    expect(list.get(0)).to.be.undefined;
    expect(list.pop()).to.be.undefined;
    expect(list.shift()).to.be.undefined;
  });

  it('should push to list', function () {
    const list = new WeakList();
    list.push(hello, world);
    expect(list.has(hello)).to.be.true;
    expect(list.has(world)).to.be.true;
    expect(list.length).to.be.equal(2);
  });

  it('should unshift to list', function () {
    const list = new WeakList();
    list.unshift(hello, world);
    expect(list.has(hello)).to.be.true;
    expect(list.has(world)).to.be.true;
    expect(list.length).to.be.equal(2);
  });

  it('should add items in the correct orders', function () {
    const list = new WeakList();
    list.push(hello, world);
    expect(list.get(0)).to.be.equal(hello);
    expect(list.get(1)).to.be.equal(world);
    expect(list.length).to.be.equal(2);

    list.unshift(first, second);
    list.push(last);
    expect(list.get(0)).to.be.equal(first);
    expect(list.get(1)).to.be.equal(second);
    expect(list.length).to.be.equal(5);
    expect(list.get(list.length - 1)).to.be.equal(last);
  });

  it('should pop and shift items', function () {
    const list = new WeakList();
    list.push(hello, world);
    list.unshift(first);
    list.push(last);

    expect(list.length).to.be.equal(4);
    expect(list.pop()).to.be.equal(last);
    expect(list.length).to.be.equal(3);
    expect(list.pop()).to.be.equal(world);
    expect(list.length).to.be.equal(2);
    expect(list.has(first)).to.be.true;
    expect(list.shift()).to.be.equal(first);
    expect(list.has(first)).to.be.false;
    expect(list.length).to.be.equal(1);
  });
});