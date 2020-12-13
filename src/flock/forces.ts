import { pipe } from "ramda"
import { average, I3, invert, magSquared, newV3, normalize, scale, sub, sum, V3 } from "../lib/v3"
import { Bee, Context } from "../types"

export const calcSeparationForce = (ctx: Context, bee: Bee, neighbors: Bee[]): I3 => {
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
  
export  const calcCohesiveForce = (
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
  
export  const calcAlignmentForce = (
    ctx: Context,
    bee: Bee,
    neighbors: Bee[]
  ): I3 => {
    if (neighbors.length === 0) {
      return newV3(0,0,0)
    }
  
    const weightedHeading = average(
      neighbors.map((n) => {
        const delta = sub(n.pos)(bee.pos)
        return scale(1 / magSquared(delta))(n.vel)
      })
    )
  
    const influence = scale(ctx.params.alignmentForce.cache)(
      weightedHeading
    )
    return influence
  }
  