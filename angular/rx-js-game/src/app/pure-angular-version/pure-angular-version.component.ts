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
        this.paddle = new Box(330, 550, 310, 20);

        this.timeout();
    }

    ngOnInit() {
    }

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

    timeout() {
        setTimeout(() => {
            this.game = this.gameService.moveBall(this.game, this.paddle);

            if (!this.game.isOver) { 
              this.timeout();
            }
        }, 1000 / 60);
    }
}
