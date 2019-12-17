import { Box } from './box';

export class BoxWithLives extends Box {

    lives: number;

    constructor(horizontalCoord: number, verticalCoord: number, width: number, height: number,
        lives: number) {

        super(horizontalCoord, verticalCoord, width, height);
        this.lives = lives;
    }
}
