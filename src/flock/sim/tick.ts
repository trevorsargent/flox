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
  ctx.agents.forEach(applyForces(ctx))
}

const updateFlockPositions = (ctx: Context): void => {
  ctx.agents.forEach(applyVelocities(ctx))
}

const updateFlockPopulation = (ctx: Context): void => {
  ensurePopulation(ctx)
}

const applyVelocities = (ctx: Context) => (agent: Agent): void => {
  agent.setMinSpeed(ctx.params.minSpeed)
  agent.setMaxSpeed(ctx.params.maxSpeed)
  agent.setMaxForce(ctx.params.maxForce)
  agent.tick()
}

const applyForces = (ctx: Context) => (agent: Agent): void => {
  const neighbors = getNeighbors(ctx, agent)

  const bounding = calcBoundingForce(ctx, agent)
  agent.applyForce(bounding)

  if (neighbors.length < 0) {
    return
  }

  const cohesive = calcCohesiveForce(ctx, agent, neighbors)
  agent.applyForce(cohesive)

  const alignment = calcAlignmentForce(ctx, agent, neighbors)
  agent.applyForce(alignment)

  const separation = calcSeparationForce(ctx, agent, neighbors)
  agent.applyForce(separation)
}

const ensurePopulation = (ctx: Context): void => {
  const target = ctx.params.targetPopulation

  if (ctx.agents.length < target) {
    ctx.agents.push(new Agent())
  }

  if (ctx.agents.length > target) {
    ctx.agents.shift()
  }
}
