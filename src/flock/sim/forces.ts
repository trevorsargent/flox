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
import { Agent } from '../types/agent'
import { Context } from '../types/flock'

export const calcBoundingForce = (ctx: Context, agent: Agent): I3 => {
  const bounds: I3 = {
    x: ctx.params.boundX,
    y: ctx.params.boundY,
    z: ctx.params.boundZ
  }

  const target = forAllComponenets((g) => {
    const pos = g(agent.pos)
    const vel = g(agent.vel)
    const fpos = pos + 3 * vel
    const bound = g(bounds)
    const sign = -1 * (Math.abs(pos) / pos)

    if (!(Math.abs(fpos) > bound)) {
      return 0
    }
    return sign * Math.pow(Math.abs(fpos - bound), 2)
  })

  const steering = sub(target)(agent.vel)
  return steering
}

export const calcSeparationForce = (
  ctx: Context,
  agent: Agent,
  neighbors: Agent[]
): I3 => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const target = sum(
    neighbors.map((n) => {
      const delta = sub(n.pos)(agent.pos)
      const mag = magSquared(delta)
      const scaled = scale(1 / (mag > 0 ? mag : 1))(delta)
      return scaled
    })
  )

  const steering = sub(target)(agent.vel)

  const separationForce = pipe(
    invert,
    scale(ctx.params.separationForce)
  )(steering)

  return separationForce
}

export const calcCohesiveForce = (
  ctx: Context,
  agent: Agent,
  neighbors: Agent[]
) => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const centerOfMass = average(neighbors.map((n) => n.pos))

  const target = sub(centerOfMass)(agent.pos)
  const steering = sub(target)(agent.vel)

  const cohesiveForce = pipe(
    normalize,
    scale(ctx.params.cohesiveForce)
  )(steering)

  return cohesiveForce
}

export const calcAlignmentForce = (
  ctx: Context,
  agent: Agent,
  neighbors: Agent[]
): I3 => {
  if (neighbors.length === 0) {
    return newV3(0, 0, 0)
  }

  const target = average(
    neighbors.map((n) => {
      // return n.vel
      const delta = sub(n.pos)(agent.pos)
      const mag = magSquared(delta)
      return scale(1 / (mag > 0 ? mag : 1))(n.vel)
    })
  )

  const steering = sub(target)(agent.vel)

  const alignmentForce = pipe(
    normalize,
    scale(ctx.params.alignmentForce)
  )(steering)

  return alignmentForce
}
