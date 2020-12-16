import { I3, V3 } from './lib/v3'
import { setup } from './render/setup'
import { tick } from './render/update'

export class Flock {
  public readonly context: Context

  constructor() {
    this.context = setup()
  }

  bees() {
    return this.context.bees
  }

  update(params?: ParamSet<Param>) {
    if (params) {
      Object.assign(this.context.params, params)
    }

    tick(this.context)
  }
}

export interface Context {
  bees: Bee[]
  // canvas: Canvas
  bounds: I3
  params: ParamSet<Param>
  debugOptions: {
    showViewArea: boolean
    showVelocityVectors: boolean
  }
  zones: ZoneCache
}

export type Param = number

export type ParamSet<T> = {
  targetPopulation: T
  viewDistance: T
  viewAngle: T
  maxSpeed: T
  cohesiveForce: T
  separationForce: T
  alignmentForce: T
}

export interface Bee {
  id: string
  pos: V3
  vel: V3
}

export interface Canvas {
  center: I3
  dims: I3
}

export type ZoneCache = SmartMap<
  number,
  SmartMap<number, SmartMap<number, Set<Bee>>>
>

export class SmartMap<T, U> {
  private map: Map<T, U>

  constructor(private newFunc: () => U) {
    this.map = new Map<T, U>()
  }

  originalGet(key: T): U | undefined {
    return this.map.get(key)
  }

  get(key: T) {
    try {
      const g = this.map.get(key)
      if (!g) {
        throw 1
      }
      return this.map.get(key)
    } catch {
      this.map.set(key, this.newFunc())
      return this.map.get(key)
    }
  }
}
