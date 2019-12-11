import { Box } from './box';

export class Ball extends Box {

    horizontalMovement: number;
    verticalMovement: number;

    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number,
        horizontalMovement: number, verticalMovement: number) {

        super(horizontalCoord, verticalCoord, width, height);
        this.horizontalMovement = horizontalMovement;
        this.verticalMovement = verticalMovement;
    }
}
