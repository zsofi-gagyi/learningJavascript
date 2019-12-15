import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { Box } from '../models/box';
import { Ball } from '../models/ball';
import { Block } from '../models/block';
import { intersection, LineSegment, Point } from './intersection-detector.service';

@Injectable({
  providedIn: 'root'
})
export class VariableTimeGameService {

    lineSegmentsDoIntersect;

    constructor() {
      //this method is from a module written by someone else
      //if it was part of a class, I'd inject it for clarity
      this.lineSegmentsDoIntersect = intersection;
    }

    moveBall(game: Game, paddle: Box, time: number): Game {
        this.moveBallBy(game.ball,
            game.ball.horizontalMovement * time,
            game.ball.verticalMovement * time);

        this.reflectBallFromPaddleIfTouchingOrCrossed(game, paddle);

        this.reflectBallFromBlocksIfTouchingOrCrossed(game.ball, game.blocks);
        game.blocks = game.blocks.filter(block => block.lives);

        this.reflectBallFromWallsIfTouchingOrCrossed(game);

        this.checkIfGameIsOver(game);

        return game;
    }

    moveBallBy(ball: Ball, horizontalMovement: number, verticalMovement: number) {
        ball.horizontalCoord += horizontalMovement;
        ball.verticalCoord += verticalMovement;

        ball.updateLimits();
    }

    reflectBallFromPaddleIfTouchingOrCrossed(game: Game, paddle: Box) {
        paddle.updateLimits();

            //the ball is low enough to be reflected (but not too low)     and
        if (game.ball.limits.lower >= paddle.limits.upper &&
            game.ball.limits.lower <= paddle.limits.upper + 10 &&

            //is in the correct coordonate range, horizontally
            (game.ball.limits.left >= paddle.limits.left - game.ball.width &&
             game.ball.limits.right <= paddle.limits.right + game.ball.width)
        ) {
            this.backtrackBallToCrossedLimit(game.ball, paddle.limits.upper, game.ball.limits.lower, true);
            game.ball.verticalMovement *= -1;
        }
    }

    //TODO: for more accuracy, store the backtracked distance and add it later
    //to the ball's movement in the correct direction
    backtrackBallToCrossedLimit(ball: Ball, coordinateOfCrossedBoundary: number,
        coordinateOfBallLeadingEdge: number, reflectionIsHorizontal: boolean) {

        let calculatedOvershootingDistances = { horizontally: 0, vertically: 0 };

        if (reflectionIsHorizontal) {
            calculatedOvershootingDistances = this.reflectHorizontally(ball,
                coordinateOfBallLeadingEdge, coordinateOfCrossedBoundary);
        } else {
            calculatedOvershootingDistances = this.reflectVertically(ball,
                coordinateOfBallLeadingEdge, coordinateOfCrossedBoundary);
        }

        this.moveBallBy(ball,
            calculatedOvershootingDistances.horizontally * -1,
            calculatedOvershootingDistances.vertically * -1);
    }

    reflectHorizontally(ball: Ball, coordinateOfBallLeadingEdge: number, coordinateOfCrossedBoundary: number):
                                                                  { horizontally: number, vertically: number } {
        let verticalDistanceToUndo = coordinateOfBallLeadingEdge - coordinateOfCrossedBoundary;

        return {
            horizontally: ball.horizontalMovement / ball.verticalMovement * verticalDistanceToUndo,
            vertically: verticalDistanceToUndo
        };
    }

    reflectVertically(ball: Ball, coordinateOfBallLeadingEdge: number, coordinateOfCrossedBoundary: number): 
                                                                  { horizontally: number, vertically: number } {
        let horizontalDistanceToUndo = coordinateOfBallLeadingEdge - coordinateOfCrossedBoundary;

        return {
            horizontally: horizontalDistanceToUndo,
            vertically: ball.verticalMovement / ball.horizontalMovement * horizontalDistanceToUndo
        };
    }

    reflectBallFromBlocksIfTouchingOrCrossed(ball: Ball, blocks: Block[]) {

        let touchedBlocks = blocks.filter(block =>
            block.limits.lower >= ball.limits.upper &&
            block.limits.upper <= ball.limits.lower &&
            block.limits.right >= ball.limits.left &&
            block.limits.left <= ball.limits.right);

        //TODO differentiate between the case of the ball being reflected by blocks forming a corner
        //or a wall (implicitly assumed in the code below)
        if (touchedBlocks.length) {

            touchedBlocks[0].lives--;

            this.reflectBallFromBlock(ball, touchedBlocks[0]);

            if (touchedBlocks[1]) {
                touchedBlocks[1].lives--;
            }

            //the ball is small enough that it won't touch more than 2 blocks at a time
        }
    }

    reflectBallFromBlock(ball: Ball, block: Block) {

        let relevantSides = this.findAllPossiblyCrossedSides(ball, block);
        let leadingBallCorner = this.findLeadingBallCorner(ball);

        let crossedSideName = this.findCrossedSide(ball, relevantSides, leadingBallCorner);

        let reflectingSurfaceIsHorizontal : boolean; 
        let coordinateOfBallLeadingEdge : number; 

        switch (crossedSideName) {
            case "upper":
                reflectingSurfaceIsHorizontal = true;
                coordinateOfBallLeadingEdge = ball.limits.lower;
                break;
            case "lower":
                reflectingSurfaceIsHorizontal = true;
                coordinateOfBallLeadingEdge = ball.limits.upper;
                break;
            case "left":
                reflectingSurfaceIsHorizontal = false;
                coordinateOfBallLeadingEdge = ball.limits.right;
                break;
            case "right":
                reflectingSurfaceIsHorizontal = false;
                coordinateOfBallLeadingEdge = ball.limits.left;
                break;
        }

        let coordinateOfCrossedBoundary: number;

        if (reflectingSurfaceIsHorizontal) {
            coordinateOfCrossedBoundary = relevantSides[crossedSideName][0].verticalCoord;
            ball.verticalMovement *= -1;
        } else {
            coordinateOfCrossedBoundary = relevantSides[crossedSideName][0].horizontalCoord;
            ball.horizontalMovement *= -1;
        }

        this.backtrackBallToCrossedLimit(
            ball, coordinateOfCrossedBoundary, coordinateOfBallLeadingEdge, reflectingSurfaceIsHorizontal
        );
    }

    findAllPossiblyCrossedSides(ball: Ball, block: Block): object {
        let relevantSides = {};

        //if the ball goes downward, the upper face of the box might have been crossed
        if (ball.verticalMovement > 0) {
            this.registerSideCrossing(relevantSides, "upper",
                block.limits.left, block.limits.upper,
                block.limits.right, block.limits.upper);
        }

        //if the ball goes upward, the lower face of the box might have been crossed
        if (ball.verticalMovement < 0) {
            this.registerSideCrossing(relevantSides, "lower",
                block.limits.left, block.limits.lower,
                block.limits.right, block.limits.lower);
        }

        //if the ball goes rightward, the left face of the box might have been crossed
        if (ball.horizontalMovement > 0) {
            this.registerSideCrossing(relevantSides, "left",
                block.limits.left, block.limits.lower,
                block.limits.left, block.limits.upper);
        }

        //if the ball goes leftward, the right face of the box might have been crossed
        if (ball.horizontalMovement < 0) {
            this.registerSideCrossing(relevantSides, "right",
                block.limits.right, block.limits.lower,
                block.limits.right, block.limits.upper);
        }

        return relevantSides;
    }

    findLeadingBallCorner(ball: Ball): Point {
        let leadingBallCorner = new Point(0,0);

        //if the ball goes downward, the leading point is on the lower side
        if (ball.verticalMovement > 0) {
            leadingBallCorner.verticalCoord = ball.limits.lower;
        }

        //if the ball goes upward, the leading point is on the upper side
        if (ball.verticalMovement < 0) {
            leadingBallCorner.verticalCoord = ball.limits.upper;
        }

        //if the ball goes rightward, the leading point is on the right side
        if (ball.horizontalMovement > 0) {
            leadingBallCorner.horizontalCoord = ball.limits.right;
        }

        //if the ball goes leftward, the leading point is on the left side
        if (ball.horizontalMovement < 0) {
            leadingBallCorner.horizontalCoord = ball.limits.left;
        }

        return leadingBallCorner;
    }

    registerSideCrossing(relevantSides: object, sideName: string,
        firstPointHorizontal: number, firstPointVertical: number,
        secondPointHorizontal: number, secondPointVertical: number) {

        relevantSides[sideName] = [
            new Point(firstPointHorizontal, firstPointVertical),
            new Point(secondPointHorizontal, secondPointVertical)
        ];
    }

    findCrossedSide(ball: Ball, relevantSides: object, leadingBallCorner: Point): string {
        //for defining how many steps back to go for calculating the second point of the
        //ballMovementDescribingSegment
        let segmentBackTrackMultiplier = 1000;

        let ballMovementDescribingSegment = [
            // current position of the forward facing corner of the ball
            leadingBallCorner,

            // past position of the aformentioned corner
            new Point(
                leadingBallCorner.horizontalCoord - (ball.horizontalMovement * segmentBackTrackMultiplier),
                leadingBallCorner.verticalCoord - (ball.verticalMovement * segmentBackTrackMultiplier))
        ];

        let crossedSides = Array<string>();

        for (let sideName in relevantSides) {
            let crossedThisSide = this.oneOfTheLeadingCornersOfTheBallPassedTheSide(
                sideName, relevantSides, ballMovementDescribingSegment, ball);

            if (crossedThisSide) {
                crossedSides.push(sideName);
            }
        }

        let sideName = crossedSides[0];

        if (crossedSides.length > 1) {
            sideName = crossedSides.filter(side =>
                this.singleLeadingCornerOfTheBallPassedTheSide(side, relevantSides, ballMovementDescribingSegment))
            [0];
        }

        return sideName;
    }

    oneOfTheLeadingCornersOfTheBallPassedTheSide(
        sideName: string, relevantSides, ballMovementDescribingSegment: Point[], ball: Ball): boolean {

        return this.singleLeadingCornerOfTheBallPassedTheSide(sideName, relevantSides, ballMovementDescribingSegment)

            ||

            this.lineSegmentsDoIntersect(
            new LineSegment(relevantSides[sideName][0], relevantSides[sideName][1]),
            new LineSegment(
                new Point(
                    ballMovementDescribingSegment[0].horizontalCoord + ball.width * (ball.horizontalMovement > 0 ? -1 : 1),
                    ballMovementDescribingSegment[0].verticalCoord
                ),
                new Point(
                    ballMovementDescribingSegment[1].horizontalCoord + ball.width * (ball.horizontalMovement > 0 ? -1 : 1),
                    ballMovementDescribingSegment[1].verticalCoord))
            ) ||

            this.lineSegmentsDoIntersect(
            new LineSegment(relevantSides[sideName][0], relevantSides[sideName][1]),
            new LineSegment(
                new Point(
                    ballMovementDescribingSegment[0].horizontalCoord,
                    ballMovementDescribingSegment[0].verticalCoord + ball.height * (ball.verticalMovement > 0 ? -1 : 1)
                ),
                new Point(
                    ballMovementDescribingSegment[1].horizontalCoord,
                    ballMovementDescribingSegment[1].verticalCoord + ball.height * (ball.verticalMovement > 0 ? -1 : 1),
                )
            ));
    }


    singleLeadingCornerOfTheBallPassedTheSide(
        sideName: string, relevantSides, ballMovementDescribingSegment: Point[]): boolean {

        return this.lineSegmentsDoIntersect(
            new LineSegment(relevantSides[sideName][0], relevantSides[sideName][1]),
            new LineSegment(ballMovementDescribingSegment[0], ballMovementDescribingSegment[1])
        );
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
