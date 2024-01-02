// MATHS

// constants
export const TWO_PI = 2 * Math.PI;

// vec2 functions/types
export type vec2 = [number, number];

export function vec2_add(a: vec2, b: vec2): vec2 {
    return [ a[0]+b[0], a[1]+b[1] ];
}

export function vec2_mul(a: vec2, b: vec2): vec2 {
    return [ a[0]*b[0], a[1]*b[1] ];
}

export function vec2_scale(a: vec2, b: number): vec2 {
    return [ a[0]*b, a[1]*b ];
}
