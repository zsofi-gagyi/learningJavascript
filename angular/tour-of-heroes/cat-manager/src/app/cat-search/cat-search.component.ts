import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import {
    debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Cat } from '../cat';
import { CatService } from '../cat.service';

@Component({
    selector: 'app-cat-search',
    templateUrl: './cat-search.component.html',
    styleUrls: ['./cat-search.component.css']
})
export class SearchComponent implements OnInit {

    cats$: Observable<Cat[]>;

    private searchTerms = new Subject<string[]>();

    constructor(private catService: CatService) { }

    // Push a pair of search terms into the observable stream.
    search(name: string, fur: string): void {
        this.searchTerms.next([name, fur]);
    }

    ngOnInit(): void {
        this.cats$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((searchTerms: string[]) => this.catService.searchCats(searchTerms[0], searchTerms[1])),
        );
    }
}
