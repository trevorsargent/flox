import p5, { Vector, Element } from 'p5'
import { I3, V3 } from './lib/v3'

export interface Context {
  bees: Bee[]
  canvas: Canvas
  bounds: I3
  params: {
    targetPopulation: Param
    viewDistance: Param
    viewAngle: Param
    maxSpeed: Param
    cohesiveForce: Param
    separationForce: Param
    alignmentForce: Param
  }
  debugOptions: {
    showViewArea: boolean
    showVelocityVectors: boolean
  }
  zones: ZoneCache
}

export interface Param {
  ref: Element
  name: string
  cache: number
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
