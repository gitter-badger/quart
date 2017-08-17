class WeakList {
  constructor() {
    this.list = [];
    this.weakSet = new WeakSet();
  }

  push(item) {
    this.list.push(item);
    this.weakSet.add(item);
  }

  pop() {
    const item = this.list.pop();
    this.weakSet.delete(item);
    return item;
  }

  unshift(item) {
    this.list.unshift(item);
    this.weakSet.add(item);
  }

  shift() {
    const item = this.list.shift();
    this.weakSet.delete(item);
    return item;
  }

  get(index) {
    return this.list[index];
  }

  // Quicker lookup than indexOf
  has(item) {
    this.weakSet.has(item);
  }

  get length() {
    return this.list.length;
  }
}

module.exports = WeakList;