import { Component, OnInit } from '@angular/core';
import { Cat } from '../cat';
import { CatService } from '../cat.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    cats: Cat[] = [];

    constructor(private catService: CatService) { }

    ngOnInit() {
        this.getCats();
    }

    getCats(): void {
        this.catService.getCats()
            .subscribe(allCats => {
                let catsNr = allCats.length;
                if (catsNr > 4) {
                    this.cats = allCats.slice(catsNr - 4);
                } else {
                    this.cats = allCats;
                }
            });
    }
}
