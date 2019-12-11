import { Injectable } from '@angular/core';
import { Game } from './models/game';
import { Box } from './models/box';
import { Ball } from './models/ball';
import { Block } from './models/block';
import { Point } from './models/point';
import { IntersectionDetectorService } from './intersection-detector.service';

@Injectable({
  providedIn: 'root'
})
export class VariableTimeGameService {

    constructor(private intersectionDetector: IntersectionDetectorService) {
    }


    moveBall(game: Game, paddle: Box, time: number): Game {
        this.updatePositionAndLimitsOfBall(game, time);

        this.reflectBallFromPaddleIfTouchingOrCrossed(game, paddle);

        this.reflectBallFromBlocksIfTouchingOrCrossed(game.ball, game.blocks);
        game.blocks = game.blocks.filter(block => block.lives);

        this.reflectBallFromWallsIfTouchingOrCrossed(game);

        this.checkIfGameIsOver(game);

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

    reflectBallFromBlocksIfTouchingOrCrossed(ball: Ball, blocks: Block[]) {
        let touchedBlocks = blocks.filter(block =>
            block.limits.lower >= ball.limits.upper &&
            block.limits.upper <= ball.limits.lower &&
            block.limits.right >= ball.limits.left &&
            block.limits.left <= ball.limits.right);

        if (touchedBlocks.length) {

            let block = touchedBlocks[0];
                block.lives--;
            this.reflectBallFromBlock(ball, block);
        }
    }

    reflectBallFromBlock(ball: Ball, block: Block) {
        let relevantSides = {};

        let ballMovementDescribingSegment = [
            new Point(0, 0), // current position of the forward facing corner of the ball
            new Point(0, 0)  // past position of the aformentioned corner
        ];

        //for defining how many steps back to go for calculating the second point of the
        //ballMovementDescribingSegment
        let segmentBackTrackMultiplier = 1000;

        //if the ball goes downward, the upper face of the box might have been crossed
        if (ball.verticalMovement > 0) {
            relevantSides["upper"] = [
                new Point(block.limits.left, block.limits.upper),
                new Point(block.limits.right, block.limits.upper)
            ];

            ballMovementDescribingSegment[0].verticalCoord = ball.limits.lower;
            ballMovementDescribingSegment[1].verticalCoord =
                ball.limits.lower - (ball.verticalCoord * segmentBackTrackMultiplier); 
        }

        //if the ball goes upward, the lower face of the box might have been crossed
        if (ball.verticalMovement < 0) {
            relevantSides["lower"] = [
                new Point(block.limits.left, block.limits.lower),
                new Point(block.limits.right, block.limits.lower)
            ];

            ballMovementDescribingSegment[0].verticalCoord = ball.limits.upper;
            ballMovementDescribingSegment[1].verticalCoord =
                ball.limits.upper - (ball.verticalCoord * segmentBackTrackMultiplier);
        }

        //if the ball goes rightward, the left face of the box might have been crossed
        if (ball.horizontalMovement < 0) {
            relevantSides["left"] = [
                new Point(block.limits.left, block.limits.lower),
                new Point(block.limits.left, block.limits.upper)
            ];

            ballMovementDescribingSegment[0].horizontalCoord = ball.limits.right;
            ballMovementDescribingSegment[1].horizontalCoord =
                ball.limits.right - (ball.horizontalCoord * segmentBackTrackMultiplier); 
        }

        //if the ball goes leftward, the right face of the box might have been crossed
        if (ball.horizontalMovement > 0) {
            relevantSides["right"] = [
                new Point(block.limits.right, block.limits.lower),
                new Point(block.limits.right, block.limits.upper)
            ];

            ballMovementDescribingSegment[0].horizontalCoord = ball.limits.left;
            ballMovementDescribingSegment[1].horizontalCoord =
                ball.limits.left - (ball.horizontalCoord * segmentBackTrackMultiplier); 
        }

        for (let sideName in relevantSides) {
                let crossedThisSide = this.intersectionDetector.doLineSegmentsIntersect(
                    relevantSides[sideName][0],
                    relevantSides[sideName][1],
                    ballMovementDescribingSegment[0],
                    ballMovementDescribingSegment[1]
                );

                if (crossedThisSide) {
                    switch (sideName) {
                        case "upper":
                            //this.backtrackBallToCrossedLimit(
                         //       ball, relevantSides[sideName][0].verticalCoord, ball.limits.lower, true
                          //  );
                            ball.verticalMovement *= -1;
                            return;
                        case "lower":
                         //   this.backtrackBallToCrossedLimit(
                        //        ball, relevantSides[sideName][0].verticalCoord, ball.limits.upper, true
                         //   );
                            ball.verticalMovement *= -1;
                            return;
 
                        case "left":
                         //   this.backtrackBallToCrossedLimit(
                       //         ball, relevantSides[sideName][0].horizontalCoord, ball.limits.right, false
                        //    );
                            ball.horizontalMovement *= -1;
                            return;
                        case "right":
                        //    this.backtrackBallToCrossedLimit(
                        //        ball, relevantSides[sideName][0].horizontalCoord, ball.limits.left, false
                        //    );
                            ball.horizontalMovement *= -1;
                            return;
                    }
                }
        }

    }

    reflectBallFromWallsIfTouchingOrCrossed(game: Game) {

        //the ball is high enough to be reflected  from the ceiling
        if (game.ball.limits.upper <= 0) {
            this.backtrackBallToCrossedLimit(game.ball, 0, game.ball.limits.upper, true);
            game.ball.verticalMovement *= -1;
        }

        //the ball is leftward enough to be reflected  from the left wall
        if (game.ball.limits.left <= 0) {
            this.backtrackBallToCrossedLimit(game.ball, 0, game.ball.limits.left, false);
            game.ball.horizontalMovement *= -1;
        }

        //the ball is rightward enough to be reflected  from the right wall
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
