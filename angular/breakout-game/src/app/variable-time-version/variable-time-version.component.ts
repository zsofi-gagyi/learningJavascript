import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Game } from '../models/game';
import { VariableTimeGameService } from '../variable-time-game.service';
import { Box } from '../models/box';

@Component({
  selector: 'app-variable-time-version',
    templateUrl: './variable-time-version.component.html',
    styleUrls: ['./variable-time-version.component.css']
})
export class VariableTimeStepVersionComponent implements OnInit {

    game: Game;
    paddle: Box;

    constructor(private gameService: VariableTimeGameService) {
        this.game = new Game(false);
        this.paddle = this.game.createPaddle();

        let lastTime = Date.now();
        this.gameLoop(lastTime);
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

    gameLoop(lastTime: number) {
        setTimeout(() => {
            let currentTime = Date.now();
            let ellapsed = currentTime - lastTime;

            this.game = this.gameService.moveBall(this.game, this.paddle, ellapsed);

            if (!this.game.endingMessage) {
                this.gameLoop(currentTime);
            }

        }, Math.floor((Math.random() * 2) + 1) * 1000 / 120); 
    }
}
