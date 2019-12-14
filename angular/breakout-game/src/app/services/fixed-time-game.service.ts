import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { Box } from '../models/box';
import { Ball } from '../models/ball';

@Injectable({
    providedIn: 'root'
})
export class FixedTimeGameService {

    constructor() { }

    moveBall(game: Game, paddle: Box): Game {
        this.reflectBallFromPaddleIfTouching(game, paddle);
        this.reflectBallFromBlocksIfTouching(game);
        this.reflectBallFromWallsIfTouching(game);

        this.updateBallPositionAndLimits(game);
 
        this.checkIfGameIsOver(game);

        return game;
    }

    reflectBallFromPaddleIfTouching(game: Game, paddle: Box) {
        if (game.ball.limits.lower <= paddle.limits.upper) {
            paddle.updateLimits();
            this.reflectBallFromBox(paddle, game.ball);
        }
    }

    reflectBallFromBlocksIfTouching(game: Game) {

        let lowestBlockCorner = game.blocks
            .map(b => b.limits.lower)
            .reduce((a, b) => a > b ? a : b, 0);

        if (lowestBlockCorner >= game.ball.limits.upper) {

            for (let block of game.blocks) {
                let touched = this.reflectBallFromBox(block, game.ball);

                if (touched) {
                    block.lives--;
                    break;
                }
            }

            game.blocks = game.blocks.filter(e => e.lives);
        }
    }

    reflectBallFromBox(box: Box, ball: Ball): boolean {

        //(the RIGHT of the ball is on the same level as the LEFT of the box,      or
        if ((ball.limits.right === box.limits.left ||

            //the LEFT of the ball is on the same level as the RIGHT of the box)
            ball.limits.left === box.limits.right) &&

            //and they are vertically in the right place
            (ball.limits.lower <= box.limits.lower + ball.height &&
                ball.limits.upper >= box.limits.upper - ball.height)) {

            ball.horizontalMovement *= -1;
            return true;
        }

        //the BOTTOM of the ball is on the same level as the TOP of the box,     or
        if ((ball.limits.lower === box.limits.upper ||

            //the TOP of the ball is on the same level as the BOTTOM of the box,
            ball.limits.upper === box.limits.lower) &&

            //and they are horizontally in the right place
            (ball.limits.right <= box.limits.right + ball.width &&
                ball.limits.left >= box.limits.left - ball.width)) {

            ball.verticalMovement *= -1;
            return true;
        }

        return false;
    }

    reflectBallFromWallsIfTouching(game: Game) {
        if (game.ball.horizontalCoord <= 0 || game.ball.horizontalCoord >= game.gameWidth - game.ball.width) {
            game.ball.horizontalMovement *= -1;
        }

        if (game.ball.verticalCoord <= 0) {
            game.ball.verticalMovement *= -1;
        }
    }

    updateBallPositionAndLimits(game) {
        game.ball.horizontalCoord += game.ball.horizontalMovement;
        game.ball.verticalCoord += game.ball.verticalMovement;

        game.ball.updateLimits();
    }

    checkIfGameIsOver(game) {
        if (!game.blocks.length) {
            game.endingMessage = "You won! :)"
        }

        if (game.ball.verticalCoord > game.gameHeight) {
            game.endingMessage = "Game over :("
        }
    }
}
