import { Injectable } from '@angular/core';
import { Point } from './models/point';

@Injectable({
  providedIn: 'root'
})
export class IntersectionDetectorService {

    constructor() { }

 /**
 * @author Peter Kelley
 * @author pgkelley4@gmail.com
 * 
 * adatpted to typescript and the current project's axis notation
 */

/**
 * See if two line segments intersect. This uses the 
 * vector cross product approach described below:
 * http://stackoverflow.com/a/565282/786339
 * 
 * @param {Object} p point
 *  representing the start of the 1st line.
 * @param {Object} p2 point 
 *  representing the end of the 1st line.
 * @param {Object} q point 
 *  representing the start of the 2nd line.
 * @param {Object} q2 point 
 *  representing the end of the 2nd line.
 */
  doLineSegmentsIntersect(p: Point, p2: Point, q: Point, q2: Point): boolean {
    var r = this.subtractPoints(p2, p);
    var s = this.subtractPoints(q2, q);

    var uNumerator = this.crossProduct(this.subtractPoints(q, p), r);
    var denominator = this.crossProduct(r, s);

    if (uNumerator == 0 && denominator == 0) {
        // They are coLlinear

        // Do they touch? (Are any of the points equal?)
        if (this.equalPoints(p, q) || this.equalPoints(p, q2) || this.equalPoints(p2, q) || this.equalPoints(p2, q2)) {
            return true
        }
        // Do they overlap? (Are all the point differences in either direction the same sign)
        return !this.allEqual([
            (q.horizontalCoord - p.horizontalCoord < 0),
            (q.horizontalCoord - p2.horizontalCoord < 0),
            (q2.horizontalCoord - p.horizontalCoord < 0),
            (q2.horizontalCoord - p2.horizontalCoord < 0)]) ||
            !this.allEqual([
                (q.verticalCoord - p.verticalCoord < 0),
                (q.verticalCoord - p2.verticalCoord < 0),
                (q2.verticalCoord - p.verticalCoord < 0),
                (q2.verticalCoord - p2.verticalCoord < 0)]);
    }

    if (denominator == 0) {
        // lines are paralell
        return false;
    }

    var u = uNumerator / denominator;
    var t = this.crossProduct(this.subtractPoints(q, p), s) / denominator;

    return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}

/**
 * Calculate the cross product of the two points.
 * 
 * @param {Object} point1 point 
 * @param {Object} point2 point 
 * 
 * @return the cross product result as a float
 */
    crossProduct(point1: Point, point2: Point): number {
        return point1.horizontalCoord * point2.verticalCoord -
            point1.verticalCoord * point2.horizontalCoord;
}

/**
 * Subtract the second point from the first.
 * 
 * @param {Object} point1 point
 * @param {Object} point2 point 
 * 
 * @return the subtraction result as a point object
 */
subtractPoints(point1: Point, point2: Point): Point {
    var result = new Point(
        point1.horizontalCoord - point2.horizontalCoord,
        point1.verticalCoord - point2.verticalCoord);

    return result;
}

/**
 * See if the points are equal.
 *
 * @param {Object} point1 point 
 * @param {Object} point2 point
 * 
 * @return if the points are equal
 */
equalPoints(point1: Point, point2: Point): boolean {
    return (point1.horizontalCoord === point2.horizontalCoord) &&
        (point1.verticalCoord === point2.verticalCoord)
}

/**
 * See if all arguments are equal.
 *
 * @param {...} args arguments that will be compared by '=='.
 *
 * @return if all arguments are equal
 */
allEqual(args: boolean[]): boolean {
    var firstValue = args[0],
        i;
    for (i = 1; i < args.length; i += 1) {
        if (args[i] != firstValue) {
            return false;
        }
    }
    return true;
}
}
