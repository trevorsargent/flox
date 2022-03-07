import { Agent } from '../types/agent'
import { Context, ParamSet } from '../types/flock'

export const init = (): Context => {
  return {
    agents: [],
    params: <ParamSet<number>>{
      // agents
      targetPopulation: 0,
      maxSpeed: 0,
      minSpeed: 0,
      maxForce: 0,
      // neighbors
      viewAngle: 0,
      viewDistance: 0,
      // force coeficients
      alignmentForce: 0,
      cohesiveForce: 0,
      separationForce: 0,
      // bounds
      boundX: 0,
      boundY: 0,
      boundZ: 0
    },
    debugOptions: {
      showViewArea: false,
      showVelocityVectors: false
    }
  }
}
