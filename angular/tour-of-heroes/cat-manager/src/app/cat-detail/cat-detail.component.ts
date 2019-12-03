import { Component, OnInit, Input } from '@angular/core';
import { Cat } from '../cat';
import { ActivatedRoute } from '@angular/router';
import { CatService } from '../cat.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cat-detail',
  templateUrl: './cat-detail.component.html',
  styleUrls: ['./cat-detail.component.css']
})


export class CatDetailComponent implements OnInit {
    cat: Cat;

    constructor(
        private route: ActivatedRoute,
        private catService: CatService,
        private location: Location
    )
    {
        this.cat = { id: 0, name: "", fur: "" };
        //placeholder until the subscribed information
        //returns, to avoid errors.
    }

    ngOnInit(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.catService.getCat(id)
            .subscribe(obtainedCat => this.cat = obtainedCat);
    }

    updateCat(cat: Cat): void {
        this.catService.updateCat(cat)
            .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
