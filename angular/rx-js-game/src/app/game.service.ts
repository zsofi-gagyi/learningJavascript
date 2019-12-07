import { Injectable } from '@angular/core';
import { Game } from './game';
import { Box } from './box';
import { Ball } from './ball';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor() { }

    moveBall(game: Game, paddle: Box): Game {

        game.ball.updateCorners();

        if (game.ball.corners.lowerLeft.verticalCoord <= paddle.corners.upperLeft.verticalCoord) {
            paddle.updateCorners();
            this.reflectBallFromBox(paddle, game.ball);
        }

        let lowestBlockCorner = game.blocks
            .map(b => b.corners.lowerLeft.verticalCoord)
            .reduce((a, b) => a > b ? a : b, 0);

        if (lowestBlockCorner >= game.ball.corners.upperLeft.verticalCoord) {

            let length = game.blocks.length;
            for (let blockIndex in game.blocks) { // iterating backwards
                let block = game.blocks[length - parseInt(blockIndex) - 1];

                let touched = this.reflectBallFromBox(block, game.ball);

                if (touched) {
                    game.blocks = game.blocks.filter(e => e !== block);
                }
            }
        }

        this.reflectBallFromWallsIfNeeded(game);

        game.ball.horizontalCoord += game.ball.horizontalMovement;
        game.ball.verticalCoord += game.ball.verticalMovement;

        game.isOver = (!game.blocks.length || game.ball.verticalCoord > game.gameHeight);
        //no more blocks to destroy, OR the ball has fallen off the play area

        if (game.isOver) {
            game.ball = null;
        }

        return game;
    }

    reflectBallFromBox(box: Box, ball: Ball): boolean {

        //the RIGHT of the ball is on the same level as the LEFT of the box,      or
        if ((ball.corners.upperRight.horizontalCoord === box.corners.upperLeft.horizontalCoord ||

            //the LEFT of the ball is on the same level as the RIGHT of the box
            ball.corners.upperLeft.horizontalCoord === box.corners.upperRight.horizontalCoord) &&

            //and they are vertically in the right place
            (ball.corners.lowerRight.verticalCoord <= box.corners.lowerRight.verticalCoord + ball.height &&
                ball.corners.upperRight.verticalCoord >= box.corners.upperRight.verticalCoord - ball.height)) {

            ball.horizontalMovement *= -1;
            return true;
        }

        //the BOTTOM of the ball is on the same level as the TOP of the box,     or
        if ((ball.corners.lowerLeft.verticalCoord === box.corners.upperLeft.verticalCoord ||

            //the TOP of the ball is on the same level as the BOTTOM of the box,
            ball.corners.upperLeft.verticalCoord === box.corners.lowerLeft.verticalCoord) &&

            //and they are horizontally in the right place
            (ball.corners.upperRight.horizontalCoord <= box.corners.upperRight.horizontalCoord + ball.width &&
                ball.corners.upperLeft.horizontalCoord >= box.corners.upperLeft.horizontalCoord - ball.width)) {

            ball.verticalMovement *= -1;
            return true;
        }

        return false;
    }

    reflectBallFromWallsIfNeeded(game: Game) {
        if (game.ball.horizontalCoord <= 0 || game.ball.horizontalCoord >= game.gameWidth - game.ball.width) {
            game.ball.horizontalMovement *= -1;
        }

        if (game.ball.verticalCoord <= 0) {
            game.ball.verticalMovement *= -1;
        }
    }
}
