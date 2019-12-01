import { Component, OnInit } from '@angular/core';
import { Cat } from '../cat';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit {
    cats: Array<Cat>;
    favouriteCat: Cat;

    constructor() {
        this.favouriteCat = new Cat("darling", "orange-brown striped");
        this.cats = new Array<Cat>();
        this.cats.push(this.favouriteCat);

        this.cats.push(new Cat("fluffy", "long gray"));
        this.cats.push(new Cat("void", "shiny black"));
    }

    makeFavourite(cat: Cat) {
        this.favouriteCat = cat;
    }


    ngOnInit() {
    }
}
