import p5, { Vector, Element } from 'p5'
import { V3 } from './lib/v3'

export interface Context {
  bees: Bee[]
  canvas: Canvas
  params: {
    targetPopulation: Param
    viewDistance: Param
    viewAngle: Param
    speedMultiplier: Param
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
}
export interface Bee {
  id: string
  pos: V3
  vel: V3
}

export type Canvas = {
  center: V3
  dims: V3
}

export type ZoneCache = number[][][]