import { Injectable } from '@angular/core';
import { Game } from './game';
import { Box } from './box';
import { Ball } from './ball';

@Injectable({
  providedIn: 'root'
})
export class ComplexGameService {

    constructor() { }


    moveBall(game: Game, paddle: Box, time: number): Game {
        this.updatePositionAndLimitsOfBall(game, time);

        //this.reflectBallFromPaddleIfTouchingOrCrossed(game, paddle);
        //this.reflectBallFromBlocksIfTouchingOrCrossed(game);
        //this.reflectBallFromWallsIfTouchingOrCrossed(game);

        this.checkIfGameIsOver(game);

        console.log("ball moved to " + game.ball.horizontalCoord);

        return game;
    }

    updatePositionAndLimitsOfBall(game: Game, time: number) {
        game.ball.horizontalCoord += game.ball.horizontalMovement * time;
        game.ball.verticalCoord += game.ball.verticalMovement * time;

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
