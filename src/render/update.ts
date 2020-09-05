import p5, { Vector } from 'p5'
import { Context, Bee } from '../types'
import { newBee } from '../bee'

export const update = (p: p5, ctx: Context) => {
  const a = ctx.bees.map(ensurePopulation(p, ctx))

  const updated = {
    ...ctx,
    bees: ctx.bees
      .flatMap(ensurePopulation(p, ctx))
      .map(applyForces(p, ctx))
      .map(applyVelocities(p, ctx))
  }
  return updated
}

const applyVelocities = (p: p5, ctx: Context) => (
  bee: Bee,
  idx: number
): Bee => {
  const vv: Vector = p
    .createVector(bee.vel.x, bee.vel.y)
    .setMag(ctx.params.speedMultiplier.ref.value() as number)

  return {
    ...bee,
    pos: p.createVector(
      (bee.pos.x + ctx.canvas.dims.x + vv.x) % ctx.canvas.dims.x,
      (bee.pos.y + ctx.canvas.dims.y + vv.y) % ctx.canvas.dims.y
    )
  }
}

const applyForces = (p: p5, ctx: Context) => (bee: Bee): Bee => {
  const neighbors = ctx.bees.filter(isNeighborBee(p, ctx, bee))

  const cohesive = calcCohesiveForce(p, ctx, bee, neighbors)
  const alignment = calcAlignmentForce(p, ctx, bee, neighbors)
  const separation = calcSeparationForce(p, ctx, bee, neighbors)

  return {
    ...bee,
    vel: bee.vel //
      .copy()
      .add(cohesive)
      .add(alignment)
      .add(separation)
      .normalize()
  }
}

const calcSeparationForce = (
  p: p5,
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
): Vector => {
  if (neighbors.length === 0) {
    return p.createVector(0, 0)
  }

  const influence = neighbors.reduce(
    (f, n) => {
      const delta = Vector.sub(n.pos, bee.pos)

      return {
        force: Vector.add(f.force, delta.div(delta.magSq())),
        count: f.count + 1
      }
    },
    { force: p.createVector(0, 0), count: 0 }
  )

  return influence.force
    .mult(-1)
    .mult(ctx.params.separationForce.ref.value() as number)
}

const calcCohesiveForce = (
  p: p5, //
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
) => {
  if (neighbors.length === 0) {
    return p.createVector(0, 0)
  }

  const influence = neighbors.reduce(
    (f, n) => {
      return {
        force: Vector.add(f.force, n.pos),
        count: f.count + 1
      }
    },
    { force: p.createVector(0, 0), count: 0 }
  )

  return influence.force
    .div(influence.count)
    .sub(bee.pos)
    .normalize()
    .mult(ctx.params.cohesiveForce.ref.value() as number)
}

const calcAlignmentForce = (
  p: p5,
  ctx: Context,
  bee: Bee,
  neighbors: Bee[]
): Vector => {
  if (neighbors.length === 0) {
    return p.createVector(0, 0)
  }

  const influence = neighbors.reduce(
    (f, n) => {
      const delta = Vector.sub(n.pos, bee.pos)

      return {
        force: Vector.add(f.force, n.vel.copy().div(delta.magSq()).limit(2)),
        count: f.count + 1
      }
    },
    { force: p.createVector(0, 0), count: 0 }
  )

  return influence.force
    .div(influence.count)
    .mult(ctx.params.alignmentForce.ref.value() as number)
}

const isNeighborBee = (p: p5, ctx: Context, thisBee: Bee) => (thatBee: Bee) => {
  if (thisBee.id === thatBee.id) {
    return false
  }

  const delta = Vector.sub(thatBee.pos, thisBee.pos)

  if (delta.mag() > ctx.params.viewDistance.ref.value()) {
    return false
  }

  if (
    p.abs(delta.heading() - thisBee.vel.heading()) >
    (ctx.params.viewAngle.ref.value() as number) / 2
  ) {
    return false
  }

  return true
}

const ensurePopulation = (p: p5, ctx: Context) => (bee: Bee, idx: number) => {
  if (idx > 0) {
    return bee
  }

  if (ctx.bees.length < ctx.params.targetPopulation.ref.value()) {
    return [bee, newBee(p, ctx)]
  }

  if (ctx.bees.length > ctx.params.targetPopulation.ref.value()) {
    return []
  }

  return bee
}
