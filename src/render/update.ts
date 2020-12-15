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
  calcCohesiveForce,
  calcSeparationForce
} from '../flock/forces'
import { getNeighbors, updateZoneCache } from '../flock/neighbors'

export const update = (ctx: Context): void => {
  cacheSliderValues(ctx),
    updateFlockPopulation(ctx),
    updateZoneCache(ctx),
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
  const vv = pipe(normalize, scale(ctx.params.speedMultiplier.cache))(bee.vel)

  const newPos = newV3(
    bee.pos.x + ctx.canvas.dims.x + vv.x,
    bee.pos.y + ctx.canvas.dims.y + vv.y,
    0
  )

  if (newPos.x > ctx.canvas.dims.x / 2) {
    newPos.x = newPos.x - ctx.canvas.dims.x - 1
  }

  if (newPos.x < (-1 * ctx.canvas.dims.x) / 2) {
    newPos.x = newPos.x + ctx.canvas.dims.x + 1
  }

  if (newPos.y > ctx.canvas.dims.y / 2) {
    newPos.y = newPos.y - ctx.canvas.dims.y
  }

  if (newPos.y < (-1 * ctx.canvas.dims.y) / 2) {
    newPos.y = newPos.y + ctx.canvas.dims.y
  }

  if (newPos.z > ctx.canvas.dims.x / 2) {
    newPos.z = newPos.z - ctx.canvas.dims.x
  }

  if (newPos.z < (-1 * ctx.canvas.dims.x) / 2) {
    newPos.z = newPos.z + ctx.canvas.dims.x
  }

  if (!newPos.x || !newPos.y) {
    throw new Error('not a valid position')
  }

  bee.pos.set(newPos)
}

const applyForces = (ctx: Context) => (bee: Bee): void => {
  const neighbors = getNeighbors(ctx, bee)

  const cohesive = calcCohesiveForce(ctx, bee, neighbors)
  const alignment = calcAlignmentForce(ctx, bee, neighbors)
  const separation = calcSeparationForce(ctx, bee, neighbors)

  const forces = sum([cohesive, alignment, separation])
  const normal = pipe(normalize, scale(0.2))(forces)

  const newVelocity = pipe(add(bee.vel), normalize)(normal)

  if (!newVelocity.x || !newVelocity.y) {
    console.log('numBees', ctx.bees.length)
    console.log('neighbors', neighbors)
    console.log('cohesive', cohesive)
    console.log('alignment', alignment)
    console.log('separation', separation)
    console.log('forces', forces)
    throw new Error('not a valid velocity')
  }

  bee.vel.set(newVelocity)
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
