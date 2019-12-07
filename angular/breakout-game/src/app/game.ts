import { Box } from './box';
import { Block } from './block';
import { Ball } from './ball';

export class Game {

    gameWidth: number;
    gameHeight: number;

    blocks: Block[];
    blockLevelsNumber: number;
    levelColors: string[];

    ball: Ball;
    endingMessage: string;

    constructor() {
        this.gameWidth = 1000;
        this.gameHeight = 600;

        this.blockLevelsNumber = 3;
        this.levelColors = ["salmon", "crimson", "darkred"];
        this.blocks = this.createBlocks();

        this.ball = new Ball(480, 530, 20, 20, 5, 5);
    }

    createBlocks(): Block[] {
        let blocks = new Array<Block>();
        let startingHorizontalCoordonate = 10; 
        let startingVerticalCoordonate = 10; 

        let blockHeight = 40; 
        let blockWidth = 155; 

        for (let x = startingHorizontalCoordonate; x < this.gameWidth; x += blockWidth + 10) {
            for (let y = startingVerticalCoordonate; y < 230; y += blockHeight + 10) {
                if (Math.random() > 0.3) {
                    let lives = 1;
                    for (let i = 1; i < this.blockLevelsNumber; i++) {
                        if (Math.random() > 0.8) {
                            lives++;
                        }
                    }
                    let newBlock = new Block(x, y, blockWidth, blockHeight, lives);
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
