const timeCache = new Map<
  string,
  { totalTime: number; numCalls: number; avgTime: number }
>()

let interval: number

const disable = false

export function Measure(): any {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): any => {
    if (disable) {
      return descriptor
    }
    const originalMethod = descriptor.value
    const idText = `${target.constructor.name}.${propertyKey}`

    descriptor.value = function (...args: any[]) {
      const time = performance.now()
      const result = originalMethod.apply(this, args)
      const timeEnd = performance.now()
      const total = timeEnd - time

      const cache = timeCache.get(idText)
      const numCalls = (cache?.numCalls ?? 0) + 1
      const totalTime = (cache?.totalTime ?? 0) + total

      timeCache.set(idText, {
        avgTime: totalTime / numCalls,
        numCalls,
        totalTime
      })

      if (!interval) {
        interval = setInterval(() => {
          console.log(
            [...timeCache.entries()]
              .sort(([_, val], [__, val2]) => val2.totalTime - val.totalTime)
              .map(
                ([id, val]) =>
                  `${id} - avg: ${(val.avgTime / 1000).toFixed(
                    2
                  )} - numCalls: ${val.numCalls} - total: ${(
                    val.totalTime / 1000
                  ).toFixed(2)}`
              )
          )
        }, 5 * 1000)
      }

      return result
    }

    return descriptor
  }
}
