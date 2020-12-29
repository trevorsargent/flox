import { Agent } from '../types/agent'
import { Context, ParamSet } from '../types/flock'

export const init = (): Context => {
  return {
    agents: [new Agent()],
    params: <ParamSet<null>>{
      // agents
      targetPopulation: null,
      maxSpeed: null,
      minSpeed: null,
      maxForce: null,
      // neighbors
      viewAngle: null,
      viewDistance: null,
      // force coeficients
      alignmentForce: null,
      cohesiveForce: null,
      separationForce: null,
      // bounds
      boundX: null,
      boundY: null,
      boundZ: null
    },
    debugOptions: {
      showViewArea: false,
      showVelocityVectors: false
    },
    zones: undefined
  }
}
