import { Context, Bee } from '../types'
import { newBee } from '../bee'
import { add, clampMagnitude, newV3, scale, sum } from '../lib/v3'
import {
  calcAlignmentForce,
  calcBoundingForce,
  calcCohesiveForce,
  calcSeparationForce
} from '../flock/forces'
import { getNeighbors, updateZoneCache } from '../flock/neighbors'

export const tick = (ctx: Context): void => {
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

  bee.pos.set(newPos)
}

const applyForces = (ctx: Context) => (bee: Bee): void => {
  const neighbors = getNeighbors(ctx, bee)

  const ff = []

  const bounding = calcBoundingForce(ctx, bee)

  ff.push(bounding)

  if (neighbors.length > 0) {
    const cohesive = calcCohesiveForce(ctx, bee, neighbors)
    const alignment = calcAlignmentForce(ctx, bee, neighbors)
    const separation = calcSeparationForce(ctx, bee, neighbors)

    ff.push(cohesive)
    ff.push(alignment)
    ff.push(separation)
  }

  const forces = sum(ff)
  const normal = scale(0.2)(forces)

  const newVelocity = add(bee.vel)(normal)

  const limited = clampMagnitude(2)(ctx.params.maxSpeed)(newVelocity)

  bee.vel.set(limited)
}

const ensurePopulation = (ctx: Context): void => {
  const target = ctx.params.targetPopulation

  if (ctx.bees.length < target) {
    ctx.bees.push(newBee(ctx))
  }

  if (ctx.bees.length > target) {
    ctx.bees.shift()
  }
}
