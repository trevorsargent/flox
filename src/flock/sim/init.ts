import { Bee } from '../types/bee'
import { Context } from '../types/flock'

export const init = (): Context => {
  return {
    bees: [new Bee()],
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
}
