import { Component, OnInit, Input } from '@angular/core';
import { Cat } from '../cat';

@Component({
    selector: 'favourite',
    templateUrl: './favourite.component.html',
    styleUrls: ['./favourite.component.css']
})


export class CatDetailComponent implements OnInit {

   // @Input() cat: Cat; // one-way binding
    constructor() { }

    ngOnInit() {
    }

}
