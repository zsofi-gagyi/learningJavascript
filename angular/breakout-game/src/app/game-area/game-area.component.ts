import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../game';
import { Box } from '../box';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})
export class GameAreaComponent implements OnInit {
    @Input() game: Game;
    @Input() paddle: Box;

  constructor() { }

  ngOnInit() {
  }
}
