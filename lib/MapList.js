class MapList {
  constructor() {
    this.map = new Map();
  }

  has(key) {
    return this.map.has(key);
  }

  get(key) {
    return this.map.get(key);
  }

  hasItem(key, value) {
    return this.map.has(key) && (this.map.get(key).indexOf(value) !== -1);
  }

  copy(key) {
    if (!this.map.has(key)) return;
    return this.map.get(key).slice(0);
  }

  pop(key) {
    if (!this.map.has(key)) return;
    return this.map.get(key).pop();
  }

  shift(key) {
    if (!this.map.has(key)) return;
    return this.map.get(key).shift();
  }

  push(key, ...values) {
    const list = this.map.get(key) || [];
    list.push(...values);
    this.map.set(key, list);
  }

  unshift(key, ...values) {
    const list = this.map.get(key) || [];
    list.unshift(...values);
    this.map.set(key, list);
  }

  size(key) {
    if (!this.map.has(key)) return;
    return this.map.get(key).length;
  }
}

module.exports = MapList;