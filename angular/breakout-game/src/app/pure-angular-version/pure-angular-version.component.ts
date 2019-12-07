import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Game } from '../game';
import { GameService } from '../game.service';
import { Box } from '../box';

@Component({
  selector: 'app-pure-angular-version',
  templateUrl: './pure-angular-version.component.html',
  styleUrls: ['./pure-angular-version.component.css']
})
export class PureAngularVersionComponent implements OnInit {
    game: Game;
    paddle: Box;
   
    constructor(private gameService: GameService) {
        this.game = new Game();
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