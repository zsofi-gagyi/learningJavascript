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
        let startingHorizontalCoordonate = 25; 
        let startingVerticalCoordonate = 25; 

        let blockHeight = 30; 
        let blockWidth = 80; 

        for (let x = startingHorizontalCoordonate; x < this.gameWidth; x += blockWidth + 65) {
            for (let y = startingVerticalCoordonate; y < 300; y += blockHeight + 40) {
                if (y !== 165) {
                    let newBlock = new Box(x, y, blockWidth, blockHeight);
                    blocks.push(newBlock);
                }
            }
        }

        return blocks;
    }

    createPaddle(): Box {
        return new Box(330, 550, 310, 20);
    }
}
