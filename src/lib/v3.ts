import { compose, pipe } from 'ramda'

//
//
// Types

export interface C3<T> {
  x: T
  y: T
  z: T
}

export type I3 = C3<number>

export class V3 implements I3 {
  x: number
  y: number
  z: number

  constructor(init: I3) {
    this.x = init.x
    this.y = init.y
    this.z = init.z
  }

  set({ x, y, z }: I3): void {
    this.x = x
    this.y = y
    this.z = z
  }
}

//
//
// Utils

export const applyToComponents =
  (apply: (c: number) => number) =>
  (a: I3): I3 => ({
    x: apply(a.x),
    y: apply(a.y),
    z: apply(a.z)
  })

export const forAllComponenets = (
  forAll: (getComponent: (input: I3) => number) => number
): I3 => {
  return {
    x: forAll((a) => a.x),
    y: forAll((a) => a.y),
    z: forAll((a) => a.z)
  }
}

export const mixComponents =
  (mix: (ac: number) => (bc: number) => number) => (a: I3) => (b: I3) => ({
    x: mix(a.x)(b.x),
    y: mix(a.y)(b.y),
    z: mix(a.z)(b.z)
  })

export const addComponents = (a: I3) => a.x + a.y + a.z

//
//
// Single Vector Operations

export const invert = applyToComponents((c) => -1 * c)

export const normalize = (a: I3): I3 => {
  const mag = magnitude(a)
  const safeMag = mag > 0 ? mag : 1

  return applyToComponents((c) => c / safeMag)(a)
}

export const scale = (scale: number) => applyToComponents((c) => c * scale)

//
//
// Two Vector Operations

export const add = mixComponents((aa) => (bb) => aa + bb)

export const sub = mixComponents((aa) => (bb) => aa - bb)

//
//
// N Vector Operations

export const sum = (set: I3[]) =>
  set.reduce((sum, next) => add(sum)(next), newV3(0, 0, 0))

export const average = (set: I3[]) => pipe(sum, scale(1 / set.length))(set)

//
//
// Generation

export const newV3 = (x: number, y: number, z: number): I3 => ({ x, y, z })

export const newNormalV3 = pipe(newV3, normalize)

//
//
// Calculated Properties

export const magSquared = pipe(
  applyToComponents((c) => c * c),
  addComponents
)

export const magnitude = pipe(magSquared, Math.sqrt)

export const clampMagnitude = (min: number) => (max: number) => (a: I3) => {
  const mag = magnitude(a)

  if (mag < min) {
    return pipe(normalize, scale(min))(a)
  }

  if (mag > max) {
    return pipe(normalize, scale(max))(a)
  }

  return a
}

export const dot =
  (a: I3) =>
  (b: I3): number =>
    addComponents(mixComponents((ac) => (bc) => ac * bc)(a)(b))

export const angleBetween =
  (a: I3) =>
  (b: I3): number => {
    return Math.acos(dot(a)(b) / (magnitude(a) * magnitude(b)))
  }

export const heading2d = (a: I3) => Math.atan2(a.y, a.x)
