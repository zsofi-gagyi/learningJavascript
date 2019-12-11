import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../models/game';
import { Box } from '../models/box';

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
