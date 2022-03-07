export class SmartMap<T, U> {
  private map: Map<T, U>

  constructor(private newFunc: () => U) {
    this.map = new Map<T, U>()
  }

  get(key: T): U {
    if (!this.map.has(key)) {
      this.map.set(key, this.newFunc())
    }

    const g = this.map.get(key)
    if (!g) {
      throw 1
    }
    return g
  }

  unsafeGet(key: T): U | undefined {
    return this.map.get(key)
  }
}
