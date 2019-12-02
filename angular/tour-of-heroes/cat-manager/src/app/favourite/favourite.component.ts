import { Component, OnInit } from '@angular/core';
import { Cat } from '../cat';
import { CatService } from '../cat.service';

@Component({
    selector: 'favourite',
    templateUrl: './favourite.component.html',
    styleUrls: ['./favourite.component.css']
})


export class FavouriteComponent implements OnInit {
    fav: Cat;

    constructor(private catService: CatService) { 
    }

    ngOnInit() {
        let favId = this.catService.getFavId();
        if (favId || favId === 0) {
            this.catService.getCat(favId)
                .subscribe(obtainedCat => this.fav = obtainedCat);
        }
    }
}
