import { pipe, tryCatch, uniq } from 'ramda'
import {
  applyToComponents,
  heading2d,
  I3,
  magnitude,
  normalize,
  scale,
  sub
} from '../lib/v3'
import { Bee, Context, SmartMap, ZoneCache } from '../types'

export const getNeighbors = (ctx: Context, bee: Bee): Bee[] => {
  const chunk = getBeeChunk(ctx, bee)

  const neighbors = new Set<Bee>()

  // for (let x = chunk.x - 1; x <= chunk.x + 1; x++) {
  //   for (let y = chunk.y - 1; y <= chunk.y + 1; y++) {
  //     for (let z = chunk.z - 1; z <= chunk.y + 1; z++) {
  //       for (const b of ctx.zones
  //         .originalGet(x)
  //         ?.originalGet(y)
  //         ?.originalGet(z)
  //         ?.values() ?? []) {
  //         neighbors.add(b)
  //       }
  //     }
  //   }
  // }
  // console.log("get Neighbors", ctx.zones)

  return ctx.bees.filter(isNeighborBee(ctx, bee))

  return Array.from(neighbors).filter(isNeighborBee(ctx, bee))
}

const isNeighborBee = (ctx: Context, thisBee: Bee) => (thatBee: Bee) => {
  if (thisBee.id === thatBee.id) {
    return false
  }

  const delta = sub(thatBee.pos)(thisBee.pos)

  if (magnitude(delta) > ctx.params.viewDistance.cache) {
    return false
  }

  if (
    Math.abs(heading2d(delta) - heading2d(thisBee.vel)) >
    ctx.params.viewAngle.cache / 2
  ) {
    return false
  }

  return true
}

export const updateZoneCache = (ctx: Context): void => {
  ctx.zones = undefined

  ctx.zones = new SmartMap( // x
    () =>
      new SmartMap( // y
        () =>
          new SmartMap( // z
            () => new Set<Bee>() // there they are!
          )
      )
  )

  ctx.bees.forEach((bee) => {
    const chunk = getBeeChunk(ctx, bee)

    const x = ctx.zones.get(chunk.x)

    const y = x.get(chunk.y)

    const z = y.get(chunk.z)

    z.add(bee)
  })
}

function getBeeChunk(ctx: Context, bee: Bee): I3 {
  const resolution = ctx.params.viewDistance.cache

  const chunk: I3 = applyToComponents((c) => Math.floor(c / resolution))(
    bee.pos
  )

  return chunk
}
