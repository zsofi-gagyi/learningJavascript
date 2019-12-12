import { Injectable } from '@angular/core';
import { Point } from './models/point';

// by Timm Preetz, copied from here: https://gist.github.com/tp/75cb619a7e40e6ad008ef2a6837bbdb2
// based on: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect

export interface Point2D {
    readonly x: number;
    readonly y: number;
}

export class LineSegment {
    public readonly start: Point2D;
    public readonly end: Point2D;

    public readonly length: number;
    public readonly direction: Point2D;

    constructor(start: Point, end: Point) {
        this.start = {
            x: start.horizontalCoord,
            y: start.verticalCoord
        };
        this.end = {
            x: end.horizontalCoord,
            y: end.verticalCoord
        };

        this.length = distance(this.start, this.end);

        if (this.length === 0 || isNaN(this.length) || !isFinite(this.length)) {
            throw new Error('Invalid length');
        }

        this.direction = {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
        };
    }
}

export function distance(p1: Point2D, p2: Point2D): number {
    const distance = Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));

    return distance;
}

export function subtractPoints(a: Point2D, b: Point2D): Point2D {
    return { x: a.x - b.x, y: a.y - b.y };
}

export function addPoints(a: Point2D, b: Point2D): Point2D {
    return { x: a.x + b.x, y: a.y + b.y };
}

function dot(u: Point2D, v: Point2D): number {
    return u.x * v.x + u.y + v.y;
}

/**
 * 2-dimensional vector cross product v × w = vx wy − vy wx
 */
function cross(v: Point2D, w: Point2D): number {
    return v.x * w.y - v.y * w.x;
}

const epsilon = 1 / 1000000;
function equals0(x: number) {
    return Math.abs(x) < epsilon;
}

/**
 *
 * p + t r = q + u s
 *
 */

export function intersection(ls0: LineSegment, ls1: LineSegment): boolean {
    const p = ls0.start;
    const r = ls0.direction;
    const q = ls1.start;
    const s = ls1.direction;

    // r × s
    const r_s = cross(r, s);
    // (q − p) × r
    const q_p_r = cross(subtractPoints(q, p), r);

    if (equals0(r_s) && equals0(q_p_r)) {
        // t0 = (q − p) · r / (r · r)
        // const t0 = dot(subtractPoints(q, p), r) / dot(r, r);

        // t1 = (q + s − p) · r / (r · r) = t0 + s · r / (r · r)
        // const t1 = t0 + dot(s, r) / dot(r, r);

        // NOTE(tp): For some reason (which I haven't spotted yet), the above t0 and hence t1 is wrong
        // So resorting to calculating it 'backwards'
        const t1 = dot(addPoints(q, subtractPoints(s, p)), r) / dot(r, r);
        const t0 = t1 - dot(s, r) / dot(r, r);

        if (t0 >= 0 && t0 <= 1 || t1 >= 0 && t1 <= 1) {
            return true;
        }

        return false;
    }

    if (equals0(r_s) && !equals0(q_p_r)) {
        return false;
    }

    // t = (q − p) × s / (r × s)
    const t = cross(subtractPoints(q, p), s) / cross(r, s);

    // u = (q − p) × r / (r × s)
    const u = cross(subtractPoints(q, p), r) / cross(r, s);

    if (!equals0(r_s) && t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return true;
    }

    return false;
}
