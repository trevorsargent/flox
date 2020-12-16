import { Context, Bee } from '../types'
import { newBee } from '../bee'
import {
  add,
  average,
  heading2d,
  invert,
  magnitude,
  magSquared,
  newV3,
  normalize,
  scale,
  sub,
  sum,
  V3
} from '../lib/v3'
import { pipe } from 'ramda'
import {
  calcAlignmentForce,
  calcBoundingForce,
  calcCohesiveForce,
  calcSeparationForce
} from '../flock/forces'
import { getNeighbors, updateZoneCache } from '../flock/neighbors'

export const update = (ctx: Context): void => {
  cacheSliderValues(ctx),
    updateFlockPopulation(ctx),
    // updateZoneCache(ctx),
    updateFlockVelocities(ctx),
    updateFlockPositions(ctx)
}

const updateFlockVelocities = (ctx: Context): void => {
  ctx.bees.forEach(applyForces(ctx))
}

const updateFlockPositions = (ctx: Context): void => {
  ctx.bees.forEach(applyVelocities(ctx))
}

const updateFlockPopulation = (ctx: Context): void => {
  ensurePopulation(ctx)
}

const applyVelocities = (ctx: Context) => (bee: Bee): void => {
  const vv = bee.vel

  const newPos = newV3(bee.pos.x + vv.x, bee.pos.y + vv.y, bee.pos.z + vv.z)

  // if (newPos.x > ctx.canvas.dims.x / 2) {
  //   newPos.x = newPos.x - ctx.canvas.dims.x - 1
  // }

  // if (newPos.x < (-1 * ctx.canvas.dims.x) / 2) {
  //   newPos.x = newPos.x + ctx.canvas.dims.x + 1
  // }

  // if (newPos.y > ctx.canvas.dims.y / 2) {
  //   newPos.y = newPos.y - ctx.canvas.dims.y
  // }

  // if (newPos.y < (-1 * ctx.canvas.dims.y) / 2) {
  //   newPos.y = newPos.y + ctx.canvas.dims.y
  // }

  bee.pos.set(newPos)
}

const applyForces = (ctx: Context) => (bee: Bee): void => {
  const neighbors = getNeighbors(ctx, bee)

  const cohesive = calcCohesiveForce(ctx, bee, neighbors)
  const alignment = calcAlignmentForce(ctx, bee, neighbors)
  const separation = calcSeparationForce(ctx, bee, neighbors)

  const bounding = calcBoundingForce(ctx, bee)

  const forces = sum([cohesive, alignment, separation, bounding])
  const normal = scale(0.2)(forces)

  const newVelocity = add(bee.vel)(normal)

  const mag = magnitude(newVelocity)

  const limited =
    mag > ctx.params.speedMultiplier.cache
      ? pipe(normalize, scale(ctx.params.speedMultiplier.cache))(newVelocity)
      : newVelocity

  if (!newVelocity.x || !newVelocity.y || !newVelocity.z) {
    console.log('numBees', ctx.bees.length)
    console.log('neighbors', neighbors)
    console.log('cohesive', cohesive)
    console.log('alignment', alignment)
    console.log('separation', separation)
    console.log('forces', forces)
    throw new Error('not a valid velocity')
  }

  bee.vel.set(limited)
}

const ensurePopulation = (ctx: Context): void => {
  const target = ctx.params.targetPopulation.cache

  if (ctx.bees.length < target) {
    ctx.bees.push(newBee(ctx))
  }

  if (ctx.bees.length > target) {
    ctx.bees.shift()
  }
}

const cacheSliderValues = (ctx: Context): void => {
  Object.values(ctx.params).forEach((param) => {
    param.cache = param.ref.value() as number
  })
}
