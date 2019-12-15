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

    constructor(fixedStep: boolean) {
        this.gameWidth = 1000;
        this.gameHeight = 600;

        this.blockLevelsNumber = 3;
        this.levelColors = ["salmon", "crimson", "darkred"];
        this.blocks = this.createBlocks();

        //if the game loop has a fixed step, the ball's movement only has to represent the
        //distance it crosses during that step (1/60 second), but if we are working with
        //a variable-time step, we will use this parameter to definte its distance / time
        //reference (still 1/60 second).
        let speedCoefficient = fixedStep ? 1 : 1000 / 60;

        this.ball = new Ball(480, 520, 25, 25, -5 / speedCoefficient, -5 / speedCoefficient);
    }

    createBlocks(): Block[] {
        let blocks = new Array<Block>();
        let startingHorizontalCoordonate = 10; 
        let startingVerticalCoordonate = 10; 

        let blockHeight = 40; 
        let blockWidth = 155; 

        for (let x = startingHorizontalCoordonate; x < this.gameWidth; x += blockWidth + 10) {
            for (let y = startingVerticalCoordonate; y < 230; y += blockHeight + 10) {
                if (Math.random() > 0.35) {
                    let lives = 1;
                    for (let i = 1; i < this.blockLevelsNumber; i++) {
                        if (Math.random() > 0.75) {
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
