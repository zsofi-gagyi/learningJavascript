import { Box } from './box';
import { Corners } from './corners';

export class Ball extends Box {

    horizontalMovement: number;
    verticalMovement: number;

    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number,
        horizontalMovement: number, verticalMovement: number) {

        super(horizontalCoord, verticalCoord, width, height);
        this.horizontalMovement = horizontalMovement;
        this.verticalMovement = verticalMovement;
    }

    updateCorners() { //TODO do this right with inheritance
        this.corners = new Corners(this.horizontalCoord, this.verticalCoord, this.width, this.height);
    }
}
