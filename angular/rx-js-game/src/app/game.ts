import { Box } from './box';
import { Ball } from './ball';

export class Game {

    gameWidth: number;
    gameHeight: number;

    blocks: Box[];
    ball: Ball;
    isOver: boolean;

    constructor() {
        this.gameWidth = 1000;
        this.gameHeight = 600;
        this.blocks = this.createBlocks();
        this.ball = new Ball(480, 530, 20, 20, 5, 5);
        this.isOver = false;
    }

    createBlocks(): Box[] {
        let blocks = new Array<Box>();
        let startingHorizontalCoordonate = 10;
        let startingVerticalCoordonate = 10;

        let blockHeight = 50;
        let blockWidth = 155;

        for (let x = startingHorizontalCoordonate; x < this.gameWidth; x += blockWidth + 10) {
            for (let y = startingVerticalCoordonate; y < 250; y += blockHeight + 25) {
                if (y !== 160) {           // for purely aesthetic / game enjoyment reasons
                    let newBlock = new Box(x, y, blockWidth, blockHeight);
                    blocks.push(newBlock);
                }
            }
        }

        return blocks;
    }
}
