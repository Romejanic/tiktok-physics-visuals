// MATHS

// constants
export const TWO_PI = 2 * Math.PI;

// color functions
export function randomColor() {
    const r = Math.floor(Math.random() * 255).toString(16).padStart(2, '');
    const g = Math.floor(Math.random() * 255).toString(16).padStart(2, '');
    const b = Math.floor(Math.random() * 255).toString(16).padStart(2, '');
    return `#${r}${g}${b}`;
}

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
