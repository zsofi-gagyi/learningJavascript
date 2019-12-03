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

    delete(id: number) {
        //delete from the server
        this.catService.delete(id).subscribe();

        //delete locally, so we don't need to reload
        const cat = this.cats.filter(c => c.id === id)[0];
        var index = this.cats.indexOf(cat);
        this.cats.splice(index, 1);
    }

    ngOnInit() {
        let observableOfGettingTheList = this.catService.getCats();
        observableOfGettingTheList.subscribe(catsList => this.cats = catsList);

        this.favouriteId = this.catService.getFavId();
    }
}
