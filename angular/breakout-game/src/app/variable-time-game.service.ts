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

            //is in the correct coordonate range, horizontally
            (game.ball.limits.left >= paddle.limits.left - game.ball.width &&
             game.ball.limits.right <= paddle.limits.right + game.ball.width)
        ) {
            this.backtrackBallToCrossedLimit(game.ball, paddle.limits.upper, game.ball.limits.lower, true);
            game.ball.verticalMovement *= -1;
        }
    }

    //TODO: for more accuracy, add the backtracked distance to the ball's movement in the correct
    //direction
    backtrackBallToCrossedLimit(ball: Ball, crossedBoundaryCoordonate: number,
                                coordinateOfBallLimitCrossingTheBoundary: number, reflectionIsHorizontal: boolean) {
        if (reflectionIsHorizontal) {
            this.reflectHorizontally(ball, coordinateOfBallLimitCrossingTheBoundary, crossedBoundaryCoordonate);
        } else {
            this.reflectVertically(ball, coordinateOfBallLimitCrossingTheBoundary, crossedBoundaryCoordonate);
        }

        ball.updateLimits();
    }

    reflectHorizontally(ball: Ball, coordinateOfBallCrossingTheLimit: number, crossedLimitCoordonate: number) {
        let verticalDistanceToUndo = coordinateOfBallCrossingTheLimit - crossedLimitCoordonate;
        let horizontalDistanceToUndo = ball.horizontalMovement / ball.verticalMovement * verticalDistanceToUndo;

        ball.horizontalCoord += -1 * horizontalDistanceToUndo;
        ball.verticalCoord += -1 * verticalDistanceToUndo;
    }

    reflectVertically(ball: Ball, coordinateOfBallCrossingTheLimit: number, crossedLimitCoordonate: number) {
        let horizontalDistanceToUndo = coordinateOfBallCrossingTheLimit - crossedLimitCoordonate;
        let verticalDistanceToUndo = ball.verticalMovement / ball.horizontalMovement * horizontalDistanceToUndo;

        ball.horizontalCoord += -1 * horizontalDistanceToUndo;
        ball.verticalCoord += -1 * verticalDistanceToUndo;
    }

    reflectBallFromWallsIfTouchingOrCrossed(game: Game) {

        //the ball is high enough to be reflected  from the ceiling
        if (game.ball.limits.upper <= 0) {
            this.backtrackBallToCrossedLimit(game.ball, 0, game.ball.limits.upper, true);
            game.ball.verticalMovement *= -1;
        }

        //the ball is left enough to be reflected  from the left wall
        if (game.ball.limits.left <= 0) {
            this.backtrackBallToCrossedLimit(game.ball, 0, game.ball.limits.left, false);
            game.ball.horizontalMovement *= -1;
        }

        //the ball is right enough to be reflected  from the right wall
        if (game.ball.limits.right >= game.gameWidth) {
            this.backtrackBallToCrossedLimit(game.ball, game.gameWidth, game.ball.limits.right, false);
            game.ball.horizontalMovement *= -1;
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
