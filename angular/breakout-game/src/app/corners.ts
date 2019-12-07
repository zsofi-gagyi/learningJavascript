import { Point } from './point';

export class Corners {

    lowerRight: Point;
    upperRight: Point;
    upperLeft: Point;
    lowerLeft: Point;

    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number) {
        this.upperLeft = new Point(horizontalCoord, verticalCoord);
        this.lowerLeft = new Point(horizontalCoord, verticalCoord + height);
        this.upperRight = new Point(horizontalCoord + width, verticalCoord);
        this.lowerRight = new Point(horizontalCoord + width, verticalCoord + height);
    }
}
