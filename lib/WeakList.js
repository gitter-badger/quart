class WeakList {
  constructor() {
    this.list = [];
    this.weakSet = new WeakSet();
  }

  push(...items) {
    this.list.push(...items);
    for (let i = 0; i < items.length; i++) {
      this.weakSet.add(items[i]);
    }
  }

  pop() {
    const item = this.list.pop();
    this.weakSet.delete(item);
    return item;
  }

  unshift(...items) {
    this.list.unshift(...items);
    for (let i = 0; i < items.length; i++) {
      this.weakSet.add(items[i]);
    }
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
    return this.weakSet.has(item);
  }

  get length() {
    return this.list.length;
  }
}

module.exports = WeakList;