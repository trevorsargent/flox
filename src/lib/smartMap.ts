// export class SmartMap<T, U> {
//   private map: Map<T, U>

//   constructor(private newFunc: () => U) {
//     this.map = new Map<T, U>()
//   }

//   originalGet(key: T): U | undefined {
//     return this.map.get(key)
//   }

//   get(key: T) {
//     try {
//       const g = this.map.get(key)
//       if (!g) {
//         throw 1
//       }
//       return this.map.get(key)
//     } catch {
//       this.map.set(key, this.newFunc())
//       return this.map.get(key)
//     }
//   }
// }
