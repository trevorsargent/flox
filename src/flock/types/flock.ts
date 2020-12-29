import { SmartMap } from '../../lib/smartMap'
import { C3 } from '../../lib/v3'
import { Agent } from './agent'
import { init } from '../sim/init'
import { tick } from '../sim/tick'

export class Flock {
  public readonly context: Context

  constructor() {
    this.context = init()
  }

  agents() {
    return this.context.agents
  }

  applyParams(params: Partial<ParamSet<number>>) {
    Object.assign(this.context.params, params)
  }

  tick() {
    tick(this.context)
  }
}

export type ParamSet<T> = {
  targetPopulation: T
  viewDistance: T
  viewAngle: T
  maxSpeed: T
  minSpeed: T
  maxForce: T
  cohesiveForce: T
  separationForce: T
  alignmentForce: T
  boundX: T
  boundY: T
  boundZ: T
}

export interface Context {
  agents: Agent[]
  // canvas: Canvas
  params: ParamSet<number>
  debugOptions: {
    showViewArea: boolean
    showVelocityVectors: boolean
  }
  zones: ZoneCache
}

export type ZoneCache = SmartMap<
  number,
  SmartMap<number, SmartMap<number, Set<Agent>>>
>
