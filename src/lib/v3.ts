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

// 
// 
// Single Vector Operations

export const invert = (a: V3): V3 => applyToComponents(c => -1 * c)(a)

export const magSquared = (a: V3): number => {
    const sq = applyToComponents(c => c * c)(a)   
    return sq.x + sq.y + sq.z
}

export const magnitude = (a: V3): number => Math.sqrt(magSquared(a))

export const normalize = (a: V3): V3 => {
    const mag = magnitude(a)
    return applyToComponents(c => c / mag)(a)
}

export const scale = (scale: number) => (a: V3): V3 => applyToComponents(c => c * scale)(a)

// 
// 
// Two Vector Operations

export const add = (a: V3) => (b: V3): V3 => mixComponents(aa => bb => aa + bb)(a)(b)

export const sub = (a: V3) => (b: V3): V3 => add(a)(invert(b))
