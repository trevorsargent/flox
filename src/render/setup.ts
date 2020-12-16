import { Context, Canvas } from '../types'
import p5 from 'p5'
import { newBee } from '../bee'
import { newV3 } from '../lib/v3'

export const setup = (): Context => {
  const ctx = {} as Context

  const initialContext: Context = {
    bees: [],
    params: {
      // bees
      targetPopulation: null,
      maxSpeed: null,
      // neighbors
      viewAngle: null,
      viewDistance: null,
      // force coeficients
      alignmentForce: null,
      cohesiveForce: null,
      separationForce: null
    },
    debugOptions: {
      showViewArea: false,
      showVelocityVectors: false
    },
    bounds: {
      x: 400,
      y: 300,
      z: 400
    },
    zones: undefined
  }

  Object.assign(ctx, initialContext)
  ctx.bees.push(newBee(initialContext))
  return ctx
}
