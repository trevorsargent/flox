import { Agent } from '../types/agent'
import { Context } from '../types/flock'

export const init = (): Context => {
  return {
    bees: [new Agent()],
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
      separationForce: null,
      // bounds
      bounds: {
        x: null,
        y: null,
        z: null
      }
    },
    debugOptions: {
      showViewArea: false,
      showVelocityVectors: false
    },
    zones: undefined
  }
}
