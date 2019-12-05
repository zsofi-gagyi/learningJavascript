import { Component, OnInit } from '@angular/core';
import { Cat } from '../cat';
import { CatService } from '../cat.service';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit {
    cats: Array<Cat>;
    favouriteId: number;

    constructor(private catService: CatService) { // do not write out as field
    }

    makeFavourite(cat: Cat) {
        this.catService.selectAsFavourite(cat.id);
        this.favouriteId = this.catService.getFavId();
    }

    delete(id: number) {
        //delete from the server
        //without "subscribe", the observable won't happen
        //[see: forest, if a tree falls without anyone hearing it in]
        this.catService.delete(id).subscribe();

        //delete locally, so we don't need to reload the information from the server
        const cat = this.cats.filter(c => c.id === id)[0];
        var index = this.cats.indexOf(cat);
        this.cats.splice(index, 1);
    }

    ngOnInit() {
        let observableOfTheList = this.catService.getCats();
        observableOfTheList.subscribe(catsList => this.cats = catsList);

        this.favouriteId = this.catService.getFavId();
    }
}
