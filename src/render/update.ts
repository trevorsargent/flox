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
} from '../lib'
import { pipe } from 'ramda'

export const update = (ctx: Context) => {
  const updated = {
    ...ctx,
    bees: ensurePopulation(ctx)(ctx.bees)
      .map(applyForces(ctx))
      .map(applyVelocities(ctx))
  }
  return updated
}

const applyVelocities = (ctx: Context) => (bee: Bee, idx: number): Bee => {
  
  const vv = pipe(
    normalize,
    scale(ctx.params.speedMultiplier.ref.value() as number)
  )(bee.vel)

  return {
    ...bee,
    pos: newV3(
      (bee.pos.x + ctx.canvas.dims.x + vv.x) % ctx.canvas.dims.x,
      (bee.pos.y + ctx.canvas.dims.y + vv.y) % ctx.canvas.dims.y,
      0
    )
  }
}

const applyForces = (ctx: Context) => (bee: Bee): Bee => {
  const neighbors = ctx.bees.filter(isNeighborBee(ctx, bee))

  const cohesive = calcCohesiveForce(ctx, bee, neighbors)
  const alignment = calcAlignmentForce(ctx, bee, neighbors)
  const separation = calcSeparationForce(ctx, bee, neighbors)

  
  const forces = sum([cohesive, alignment, separation])
  const normal = pipe(normalize, scale(.2))(forces)

  const newVelocity = pipe(add(bee.vel), normalize)(normal)

  return {
    ...bee,
    vel: newVelocity
  }
}

const calcSeparationForce = (ctx: Context, bee: Bee, neighbors: Bee[]): V3 => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const influence = sum(neighbors.map(n => {
    const delta = sub(n.pos)(bee.pos)
    const scaled = scale(1 / magSquared(delta))(delta)
    return scaled
  }))


  return pipe(
    invert,
    scale(ctx.params.separationForce.ref.value() as number)
  )(influence)
}

const calcCohesiveForce = (
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
) => {
  if (neighbors.length === 0) {
    return newV3(0,0,0)
  }

  const centerOfMass = average(neighbors.map((n) => n.pos))

  const cohesiveForce = pipe(
    sub(centerOfMass), // subtract from bee.pos...
    normalize,
    scale(ctx.params.cohesiveForce.ref.value() as number)
  )(bee.pos)
  return cohesiveForce
}

const calcAlignmentForce = (
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
): V3 => {
  if (neighbors.length === 0) {
    return newV3(0,0,0)
  }

  const weightedHeading = average(
    neighbors.map((n) => {
      const delta = sub(n.pos)(bee.pos)
      return scale(1 / magSquared(delta))(n.vel)
    })
  )

  const influence = scale(ctx.params.alignmentForce.ref.value() as number)(
    weightedHeading
  )
  return influence
}

const isNeighborBee = (ctx: Context, thisBee: Bee) => (thatBee: Bee) => {
  if (thisBee.id === thatBee.id) {
    return false
  }

  const delta = sub(thatBee.pos)(thisBee.pos)

  if (magnitude(delta) > ctx.params.viewDistance.ref.value()) {
    return false
  }

  if (
    Math.abs(heading2d(delta) - heading2d(thisBee.vel)) >
    (ctx.params.viewAngle.ref.value() as number) / 2
  ) {
    return false
  }

  return true
}

const ensurePopulation = (ctx: Context) => (bees: Bee[]) => {
 
  const target = ctx.params.targetPopulation.ref.value() as number

  if(bees.length < target){
    return [...bees, newBee(ctx)]
  }

  if(bees.length > target){
    return bees.slice(1)
  }
  return bees
}
