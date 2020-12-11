import {pipe} from 'ramda'

// 
// 
// Types

export interface V3 {
    x: number
    y: number
    z: number
}

// 
// 
// Utils

export const applyToComponents = (apply: (c: number) =>  number) => (a: V3): V3 => ({
    x: apply(a.x), 
    y: apply(a.y),
    z: apply(a.z)
})

export const mixComponents = (mix: (aa: number) => (bb: number) => number) => (a: V3) => (b: V3) => ({
    x: mix(a.x)(b.x), 
    y: mix(a.y)(b.y),
    z: mix(a.z)(b.z)
})

export const addComponents = (a: V3) => a.x + a.y + a.z

// 
// 
// Single Vector Operations

export const invert = applyToComponents(c => -1 * c)

export const magSquared = pipe(applyToComponents(c => c* c), addComponents)

export const magnitude = pipe(magSquared, Math.sqrt)

export const normalize = (a: V3): V3 => {
    const mag = magnitude(a)
    return applyToComponents(c => c / mag)(a)
}

export const scale = (scale: number) => 
    applyToComponents(c => c * scale)

// 
// 
// Two Vector Operations

export const add = mixComponents(aa => bb => aa + bb)

export const sub = mixComponents(aa => bb => aa - bb)

// 
// 
// Generation

export const newV3 = (x: number, y: number, z: number): V3 => ({x, y, z})

export const newNormalV3 = pipe(newV3, normalize)

