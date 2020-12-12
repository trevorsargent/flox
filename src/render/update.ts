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

export const update = (ctx: Context) => {
  const updated = pipe(
    updateFlockPopulation,
    updateZoneCache,
    updateFlockVelocities,
    updateFlockPositions
  )(ctx)
  return updated
}

const updateFlockVelocities = (ctx: Context): Context => ({
  ...ctx,
  bees: ctx.bees.map(applyForces(ctx))
})

const updateFlockPositions = (ctx: Context): Context => ({
  ...ctx,
  bees: ctx.bees.map(applyVelocities(ctx))
})

const updateFlockPopulation = (ctx: Context): Context => ({
  ...ctx,
  bees: ensurePopulation(ctx)(ctx.bees)
})

const applyVelocities = (ctx: Context) => (bee: Bee, idx: number): Bee => {
  const vv = pipe(
    normalize,
    scale(ctx.params.speedMultiplier.ref.value() as number)
  )(bee.vel)

  const newPos = newV3(
    (bee.pos.x + ctx.canvas.dims.x + vv.x) % ctx.canvas.dims.x,
    (bee.pos.y + ctx.canvas.dims.y + vv.y) % ctx.canvas.dims.y,
    0
  )

  if(!newPos.x || !newPos.y){
    throw new Error('not a valid position')
  }

  return {
    ...bee,
    pos: newPos
  }
}

const applyForces = (ctx: Context) => (bee: Bee): Bee => {
  const neighbors = getNeighbors(ctx, bee)

  const cohesive = calcCohesiveForce(ctx, bee, neighbors)
  const alignment = calcAlignmentForce(ctx, bee, neighbors)
  const separation = calcSeparationForce(ctx, bee, neighbors)

  const forces = sum([cohesive, alignment, separation])
  const normal = pipe(normalize, scale(0.2))(forces)

  const newVelocity = pipe(add(bee.vel), normalize)(normal)

  if(!newVelocity.x || !newVelocity.y){
    console.log("numBees", ctx.bees.length)
    console.log("neighbors", neighbors)
    console.log("cohesive", cohesive)
    console.log("alignment", alignment)
    console.log("separation", separation)
    console.log("forces", forces)
    throw new Error('not a valid velocity')
  }

  return {
    ...bee,
    vel: newVelocity
  }
}

const ensurePopulation = (ctx: Context) => (bees: Bee[]) => {
  const target = ctx.params.targetPopulation.ref.value() as number

  if (bees.length < target) {
    return [...bees, newBee(ctx)]
  }

  if (bees.length > target) {
    return bees.slice(1)
  }
  return bees
}
