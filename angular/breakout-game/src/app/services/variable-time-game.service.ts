import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { Box } from '../models/box';
import { Ball } from '../models/ball';
import { BoxWithLives } from '../models/boxWithLives';
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

    updateState(game: Game, paddle: Box, time: number): Game {
        this.moveBallBy(game.ball,
            game.ball.horizontalMovement * time,
            game.ball.verticalMovement * time);

        this.reflectBallFromPaddleIfTouchingOrCrossed(game.ball, paddle);

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

    reflectBallFromPaddleIfTouchingOrCrossed(ball: Ball, paddle: Box) {
        if (this.boxTouchesBall(paddle, ball)) {
            this.reflectBallFromBlock(ball, paddle);
        }
    }

    boxTouchesBall(box: Box, ball: Ball): boolean {
        return box.limits.lower >= ball.limits.upper &&
            box.limits.upper <= ball.limits.lower &&
            box.limits.right >= ball.limits.left &&
            box.limits.left <= ball.limits.right;
    }

    reflectBallFromBlocksIfTouchingOrCrossed(ball: Ball, blocks: BoxWithLives[]) {

        let touchedBlocks = blocks.filter(block => this.boxTouchesBall(block, ball));

        //TODO differentiate between the case of the ball being reflected by blocks forming a corner
        //or a wall (implicitly assumed in the code below)
        if (touchedBlocks.length) {

            this.reflectBallFromBlock(ball, touchedBlocks[0]);
            touchedBlocks.forEach(block => block.lives--);
        }
    }

    reflectBallFromBlock(ball: Ball, box: Box) {

        let possiblyCrossedSides = this.findAllPossiblyCrossedSides(ball, box);
        let leadingBallCorner = this.findLeadingBallCorner(ball);

        let crossedSideName = this.findCrossedSide(ball, possiblyCrossedSides, leadingBallCorner);

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
            coordinateOfCrossedBoundary = possiblyCrossedSides.get(crossedSideName).start.verticalCoord;
            ball.verticalMovement *= -1;
        } else {
            coordinateOfCrossedBoundary = possiblyCrossedSides.get(crossedSideName).start.horizontalCoord;
            ball.horizontalMovement *= -1;
        }

        this.moveBackBallToCrossedLimit(
            ball, coordinateOfCrossedBoundary, coordinateOfBallLeadingEdge, reflectingSurfaceIsHorizontal
        );
    }

    findAllPossiblyCrossedSides(ball: Ball, box: Box): Map<string, LineSegment> {
        let possiblyCrossedSides = new Map<string, LineSegment>();

        //if the ball goes downward, the upper face of the box might have been crossed
        if (ball.verticalMovement > 0) {
            this.registerSideCrossing(possiblyCrossedSides, "upper",
                box.limits.left, box.limits.upper,
                box.limits.right, box.limits.upper);
        }

        //if the ball goes upward, the lower face of the box might have been crossed
        if (ball.verticalMovement < 0) {
            this.registerSideCrossing(possiblyCrossedSides, "lower",
                box.limits.left, box.limits.lower,
                box.limits.right, box.limits.lower);
        }

        //if the ball goes rightward, the left face of the box might have been crossed
        if (ball.horizontalMovement > 0) {
            this.registerSideCrossing(possiblyCrossedSides, "left",
                box.limits.left, box.limits.lower,
                box.limits.left, box.limits.upper);
        }

        //if the ball goes leftward, the right face of the box might have been crossed
        if (ball.horizontalMovement < 0) {
            this.registerSideCrossing(possiblyCrossedSides, "right",
                box.limits.right, box.limits.lower,
                box.limits.right, box.limits.upper);
        }

        return possiblyCrossedSides;
    }

   registerSideCrossing(possiblyCrossedSides: Map<string, LineSegment>, sideName: string,
        firstPointHorizontal: number, firstPointVertical: number,
        secondPointHorizontal: number, secondPointVertical: number) {

            possiblyCrossedSides.set(sideName,
                new LineSegment(
                  new Point(firstPointHorizontal, firstPointVertical),
                  new Point(secondPointHorizontal, secondPointVertical)
            ));
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

    findCrossedSide(ball: Ball, possiblyCrossedSides: Map<string, LineSegment>, leadingBallCorner: Point): string {
        //for defining how many steps back to go for calculating the second point of the
        //ballMovementDescribingSegment
        let segmentBackTrackMultiplier = 1000;

        let ballPath = new LineSegment(
            // current position of the forward facing corner of the ball
            leadingBallCorner,

            // past position of the aformentioned corner
            new Point(
                leadingBallCorner.horizontalCoord - (ball.horizontalMovement * segmentBackTrackMultiplier),
                leadingBallCorner.verticalCoord - (ball.verticalMovement * segmentBackTrackMultiplier))
        );

        let crossedSides = Array<string>();

        for (let sideName of Array.from(possiblyCrossedSides.keys())) {

                //          __________   / 
                //         |__________| / /
                //                  /__/ / 
                //                  |__|/
                //  
                // searching for any of the three leading corners touching the block
            let crossedThisSide = this.oneOfTheLeadingCornersOfTheBallPassedTheSide(
                possiblyCrossedSides.get(sideName), ballPath, ball);

            if (crossedThisSide) {
                crossedSides.push(sideName);
            }
        }

        let sideName = crossedSides[0];

        if (crossedSides.length > 1) {
            sideName = crossedSides.filter(side =>

                //         __________
                //        |__________|
                //      __ / 
                //     |__|
                //
                // of the two sides touched, choosing that which has touched the main leading corner
                this.lineSegmentsDoIntersect(possiblyCrossedSides.get(side), ballPath))
            [0];
        }

        return sideName;
    }

    oneOfTheLeadingCornersOfTheBallPassedTheSide(
        side: LineSegment, ballPath: LineSegment, ball: Ball): boolean {

        return this.lineSegmentsDoIntersect(side, ballPath)

            ||

            this.lineSegmentsDoIntersect(
                side,
                new LineSegment(
                    this.shiftBackHorizontally(ballPath.start, ball),
                    this.shiftBackHorizontally(ballPath.end, ball)
            )) ||

            this.lineSegmentsDoIntersect(
                side,
                new LineSegment(
                    this.shiftBackVertically(ballPath.start, ball),
                    this.shiftBackVertically(ballPath.end, ball)
            ));
    }

    shiftBackHorizontally(point: Point, ball: Ball) {
        return new Point(
            point.horizontalCoord + ball.width * (ball.horizontalMovement > 0 ? -1 : 1),
            point.verticalCoord
        );
    }

    shiftBackVertically(point: Point, ball: Ball) {
        return new Point(
            point.horizontalCoord,
            point.verticalCoord + ball.height * (ball.verticalMovement > 0 ? -1 : 1),
        );
    }

    //TODO: for more accuracy, store the backtracked distance and add it later
    //to the ball's movement in the correct direction
    moveBackBallToCrossedLimit(ball: Ball, coordinateOfCrossedBoundary: number,
        coordinateOfBallLeadingEdge: number, reflectionIsHorizontal: boolean) {

        let calculatedOvershootingDistances = { horizontally: 0, vertically: 0 };

        if (reflectionIsHorizontal) {
            calculatedOvershootingDistances = this.backtrackToHorizontalSurface(ball,
                coordinateOfBallLeadingEdge, coordinateOfCrossedBoundary);
        } else {
            calculatedOvershootingDistances = this.backtrackToVerticalSurface(ball,
                coordinateOfBallLeadingEdge, coordinateOfCrossedBoundary);
        }

        this.moveBallBy(ball,
            calculatedOvershootingDistances.horizontally * -1,
            calculatedOvershootingDistances.vertically * -1);
    }

    backtrackToHorizontalSurface(ball: Ball, coordinateOfBallLeadingEdge: number, coordinateOfCrossedBoundary: number):
        { horizontally: number, vertically: number } {

        let verticalDistanceToUndo = coordinateOfBallLeadingEdge - coordinateOfCrossedBoundary;

        return {
            horizontally: ball.horizontalMovement / ball.verticalMovement * verticalDistanceToUndo,
            vertically: verticalDistanceToUndo
        };
    }

    backtrackToVerticalSurface(ball: Ball, coordinateOfBallLeadingEdge: number, coordinateOfCrossedBoundary: number):
        { horizontally: number, vertically: number } {

        let horizontalDistanceToUndo = coordinateOfBallLeadingEdge - coordinateOfCrossedBoundary;

        return {
            horizontally: horizontalDistanceToUndo,
            vertically: ball.verticalMovement / ball.horizontalMovement * horizontalDistanceToUndo
        };
    }

    reflectBallFromWallsIfTouchingOrCrossed(game: Game) {

        //the ball is high enough to be reflected  from the ceiling
        if (game.ball.limits.upper <= 0) {
            this.moveBackBallToCrossedLimit(game.ball, 0, game.ball.limits.upper, true);
            game.ball.verticalMovement *= -1;
        }

        //the ball is leftward enough to be reflected  from the left wall
        if (game.ball.limits.left <= 0) {
            this.moveBackBallToCrossedLimit(game.ball, 0, game.ball.limits.left, false);
            game.ball.horizontalMovement *= -1;
        }

        //the ball is rightward enough to be reflected  from the right wall
        if (game.ball.limits.right >= game.gameWidth) {
            this.moveBackBallToCrossedLimit(game.ball, game.gameWidth, game.ball.limits.right, false);
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
