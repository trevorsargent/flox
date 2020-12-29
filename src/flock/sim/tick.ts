import { Agent } from '../types/agent'
import { Context } from '../types/flock'
import {
  calcAlignmentForce,
  calcBoundingForce,
  calcCohesiveForce,
  calcSeparationForce
} from './forces'
import { getNeighbors, updateZoneCache } from './neighbors'

export const tick = (ctx: Context): void => {
  updateFlockPopulation(ctx),
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

const applyVelocities = (ctx: Context) => (bee: Agent): void => {
  bee.setMinSpeed(ctx.params.minSpeed)
  bee.setMaxSpeed(ctx.params.maxSpeed)
  bee.setMaxForce(ctx.params.maxForce)
  bee.tick()
}

const applyForces = (ctx: Context) => (bee: Agent): void => {
  const neighbors = getNeighbors(ctx, bee)

  const bounding = calcBoundingForce(ctx, bee)
  bee.applyForce(bounding)

  if (neighbors.length < 0) {
    return
  }
  
  const cohesive = calcCohesiveForce(ctx, bee, neighbors)
  bee.applyForce(cohesive)

  const alignment = calcAlignmentForce(ctx, bee, neighbors)
  bee.applyForce(alignment)

  const separation = calcSeparationForce(ctx, bee, neighbors)
  bee.applyForce(separation)
}

const ensurePopulation = (ctx: Context): void => {
  const target = ctx.params.targetPopulation

  if (ctx.bees.length < target) {
    ctx.bees.push(new Agent())
  }

  if (ctx.bees.length > target) {
    ctx.bees.shift()
  }
}
