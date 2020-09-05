import p5, { Vector, Element } from 'p5'

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
}

export interface Param {
  ref: Element
  name: string
}
export interface Bee {
  isDebugBee: boolean
  id: string
  pos: Vector
  vel: Vector
}

export type Canvas = {
  center: Vector
  dims: Vector
}
