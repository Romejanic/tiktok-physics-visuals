// MATHS

// constants
export const TWO_PI = 2 * Math.PI;

// general functions
export function lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t;
}

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

export function vec2_sub(a: vec2, b: vec2): vec2 {
    return [ a[0]-b[0], a[1]-b[1] ];
}

export function vec2_mul(a: vec2, b: vec2): vec2 {
    return [ a[0]*b[0], a[1]*b[1] ];
}

export function vec2_scale(a: vec2, b: number): vec2 {
    return [ a[0]*b, a[1]*b ];
}

export function vec2_length(v: vec2) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1]);
}

export function vec2_normalize(v: vec2) {
    return vec2_scale(v, 1 / vec2_length(v));
}

export function vec2_distance(a: vec2, b: vec2) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx*dx + dy*dy);
}
