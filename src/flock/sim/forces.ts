import { pipe } from 'ramda'
import {
  average,
  forAllComponenets,
  I3,
  invert,
  magSquared,
  newV3,
  normalize,
  scale,
  sub,
  sum
} from '../../lib/v3'
import { Bee } from '../types/bee'
import { Context } from '../types/flock'

export const calcBoundingForce = (ctx: Context, bee: Bee): I3 => {
  const target = forAllComponenets((g) => {
    const pos = g(bee.pos)
    const vel = g(bee.vel)
    const fpos = pos + 3 * vel
    const bound = g(ctx.params.bounds)
    const sign = -1 * (Math.abs(pos) / pos)

    if (!(Math.abs(fpos) > bound)) {
      return 0
    }
    return sign * Math.pow(Math.abs(fpos - bound), 2)
  })

  const steering = sub(target)(bee.vel)
  return steering
}

export const calcSeparationForce = (
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
): I3 => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const target = sum(
    neighbors.map((n) => {
      const delta = sub(n.pos)(bee.pos)
      const mag = magSquared(delta)
      const scaled = scale(1 / (mag > 0 ? mag : 1))(delta)
      return scaled
    })
  )

  const steering = sub(target)(bee.vel)

  const separationForce = pipe(
    invert,
    scale(ctx.params.separationForce)
  )(steering)

  return separationForce
}

export const calcCohesiveForce = (ctx: Context, bee: Bee, neighbors: Bee[]) => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const centerOfMass = average(neighbors.map((n) => n.pos))

  const target = sub(centerOfMass)(bee.pos)
  const steering = sub(target)(bee.vel)

  const cohesiveForce = pipe(
    normalize,
    scale(ctx.params.cohesiveForce)
  )(steering)

  return cohesiveForce
}

export const calcAlignmentForce = (
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
): I3 => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const target = average(
    neighbors.map((n) => {
      // return n.vel
      const delta = sub(n.pos)(bee.pos)
      const mag = magSquared(delta)
      return scale(1 / (mag > 0 ? mag : 1))(n.vel)
    })
  )

  const steering = sub(target)(bee.vel)

  const alignmentForce = pipe(
    normalize,
    scale(ctx.params.alignmentForce)
  )(steering)

  return alignmentForce
}
