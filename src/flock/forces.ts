import { min, pipe } from 'ramda'
import {
  add,
  average,
  I3,
  invert,
  magSquared,
  mixComponents,
  newV3,
  normalize,
  scale,
  sub,
  sum,
  V3
} from '../lib/v3'
import { Bee, Context } from '../types'

export const calcBoundingForce = (ctx: Context, bee: Bee): I3 => {
  const target = mixComponents((pos) => (bound) => {
    return Math.abs(pos) > bound
      ? -1 * (Math.abs(pos) - bound) * (Math.abs(pos) / pos) //
      : 0
  })(add(bee.pos)(scale(5)(bee.vel)))(ctx.bounds)

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
    scale(ctx.params.separationForce.cache)
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
    scale(ctx.params.cohesiveForce.cache)
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
    scale(ctx.params.alignmentForce.cache)
  )(steering)

  return alignmentForce
}
