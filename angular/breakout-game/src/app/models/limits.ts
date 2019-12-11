export class Limits {

    upper: number;
    lower: number;
    left: number;
    right: number;

    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number) {
        this.upper = verticalCoord;
        this.lower = verticalCoord + height;
        this.left = horizontalCoord;
        this.right = horizontalCoord + width;
    }
}
