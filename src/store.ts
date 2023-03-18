export class Store {
  private store: Record<string, number> = {};
  private static instance: Store;

  private constructor() {}

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    return Store.instance;
  }

  private static hash(str: string) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  set(entity: string, property: string, received: string) {
    const hash = Store.hash(`${entity}.${property}.${received}`);

    if (this.has(hash)) {
      this.store[hash]++;
    } else {
      this.store[hash] = 1;
    }
  }

  get(entity: string, property: string, received: string) {
    const hash = Store.hash(`${entity}.${property}.${received}`);
    return this.store?.[hash];
  }

  has(hash: number) {
    return this.store[hash] !== undefined;
  }

  clear() {
    this.store = {};
  }
}
