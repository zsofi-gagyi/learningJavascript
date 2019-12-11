import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Game } from '../models/game';
import { FixedTimeGameService } from '../fixed-time-game.service';
import { Box } from '../models/box';

@Component({
  selector: 'app-fixed-time-version',
    templateUrl: './fixed-time-version.component.html',
    styleUrls: ['./fixed-time-version.component.css']
})
export class FixedTimeStepVersionComponent implements OnInit {
    game: Game;
    paddle: Box;
   
    constructor(private gameService: FixedTimeGameService) {
        this.game = new Game(true);
        this.paddle = this.game.createPaddle(); 

        this.timeout(0);
    }

    ngOnInit() {
    }

    //TODO: solve this with checking the key states in the timeout loop instead,
    //to avoid that initial lag
    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);

        // arrow left
        if (event.keyCode === 39 && this.paddle.horizontalCoord < this.game.gameWidth - this.paddle.width) { 
            this.paddle.horizontalCoord += 30;
        }

        // arrow right
        if (event.keyCode === 37 && this.paddle.horizontalCoord > 0) { 
            this.paddle.horizontalCoord -= 30;
        }
    }

    timeout(time: number) {
        setTimeout(() => {
            let start = Date.now();
            this.game = this.gameService.moveBall(this.game, this.paddle);

            if (!this.game.endingMessage) {
                let end = Date.now();
                let remainingTime = (1000 / 60) - (end - start);

                this.timeout(remainingTime);
            }
        }, time);
    }
}
