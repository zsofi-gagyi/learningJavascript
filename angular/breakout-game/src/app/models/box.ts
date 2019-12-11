import { Limits } from './limits';

export class Box {

    horizontalCoord: number;
    verticalCoord: number;
    width: number;
    height: number;
    limits: Limits;


    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number) {
        this.horizontalCoord = horizontalCoord;
        this.verticalCoord = verticalCoord;
        this.width = width;
        this.height = height;
        this.limits = new Limits(horizontalCoord, verticalCoord, width, height);
    }

    updateLimits(){
        this.limits = new Limits(this.horizontalCoord, this.verticalCoord, this.width, this.height);
    }
}
