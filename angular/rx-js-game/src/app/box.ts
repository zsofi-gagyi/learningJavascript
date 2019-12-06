import { Corners } from './corners';

export class Box {

    horizontalCoord: number;
    verticalCoord: number;
    width: number;
    height: number;
    corners: Corners;


    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number) {
        this.horizontalCoord = horizontalCoord;
        this.verticalCoord = verticalCoord;
        this.width = width;
        this.height = height;
        this.corners = new Corners(horizontalCoord, verticalCoord, width, height);
    }

    updateCorners(){
        this.corners = new Corners(this.horizontalCoord, this.verticalCoord, this.width, this.height);
    }
}
