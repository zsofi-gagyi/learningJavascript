import { Injectable } from '@angular/core';
import { Game } from './models/game';
import { Box } from './models/box';
import { Ball } from './models/ball';

@Injectable({
  providedIn: 'root'
})
export class VariableTimeGameService {

    constructor() { }


    moveBall(game: Game, paddle: Box, time: number): Game {
        this.updatePositionAndLimitsOfBall(game, time);

        this.reflectBallFromPaddleIfTouchingOrCrossed(game, paddle);
        //this.reflectBallFromBlocksIfTouchingOrCrossed(game);
        this.reflectBallFromWallsIfTouchingOrCrossed(game);

        this.checkIfGameIsOver(game);

        console.log("ball moved to " + game.ball.horizontalCoord);

        return game;
    }

    updatePositionAndLimitsOfBall(game: Game, time: number) {
        game.ball.horizontalCoord += game.ball.horizontalMovement * time;
        game.ball.verticalCoord += game.ball.verticalMovement * time;

        game.ball.updateLimits();
    }

    reflectBallFromPaddleIfTouchingOrCrossed(game: Game, paddle: Box) {
        paddle.updateLimits();

            //the ball is low enough to be reflected     and
        if (game.ball.limits.lower >= paddle.limits.upper &&

            //at least a point of the ball is touching the upper part of the paddle
            (game.ball.limits.left >= paddle.limits.left - game.ball.width &&
             game.ball.limits.right <= paddle.limits.right + game.ball.width)
        ) {
            game.ball.verticalMovement *= -1;
            //TODO move it back to the boundary
        }
    }

    reflectBallFromWallsIfTouchingOrCrossed(game: Game) {

        //the ball is high enough to be reflected  from the ceiling
        if (game.ball.limits.upper <= 0) {
            game.ball.verticalMovement *= -1;
            //TODO move it back to the boundary
        }

        //the ball is left enough to be reflected  from the left wall
        if (game.ball.limits.left <= 0) {
            game.ball.horizontalMovement *= -1;
            //TODO move it back to the boundary
        }

        //the ball is right enough to be reflected  from the right wall
        if (game.ball.limits.right >= game.gameWidth) {
            game.ball.horizontalMovement *= -1;
            //TODO move it back to the boundary
        }
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
