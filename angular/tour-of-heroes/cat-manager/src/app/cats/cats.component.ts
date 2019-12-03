import { Component, OnInit } from '@angular/core';
import { Cat } from '../cat';
import { CatService } from '../cat.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit {
    cats: Array<Cat>;
    favouriteId: number;

    constructor(private catService: CatService,
                public messageService: MessageService) { // do not write out as field
    }

    makeFavourite(cat: Cat) {
        this.catService.selectAsFavourite(cat.id);
        this.favouriteId = this.catService.getFavId();
    }

    ngOnInit() {
        let observableOfGettingTheList = this.catService.getCats();
        observableOfGettingTheList.subscribe(catsList => this.cats = catsList);

        this.favouriteId = this.catService.getFavId();
    }
}
