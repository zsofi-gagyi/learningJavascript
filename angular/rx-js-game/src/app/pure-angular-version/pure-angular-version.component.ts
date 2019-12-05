import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Box } from '../box';

@Component({
  selector: 'app-pure-angular-version',
  templateUrl: './pure-angular-version.component.html',
  styleUrls: ['./pure-angular-version.component.css']
})
export class PureAngularVersionComponent implements OnInit {
    gameWidth: number = 1000;
    gameHeight: number = 600;

    paddle: Box;
    blocks: Box[];
  
   
    constructor() {
        this.paddle = new Box(420, 500, 160, 20);
        this.blocks = new Array<Box>();
    }

    ngOnInit() {
    }

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        console.log(event);

        if (event.keyCode === 39 && this.paddle.x < this.gameWidth - this.paddle.width) { // arrow left
            this.paddle.x += 10;
        }

        if (event.keyCode === 37 && this.paddle.x > 0) { // arrow right
            this.paddle.x -= 10;
        }
    }
}
