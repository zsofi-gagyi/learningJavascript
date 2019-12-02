import { Injectable } from '@angular/core';
import { Cat } from './cat';
import { CATS } from './mock-cats';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class CatService {

    constructor(private messageService: MessageService) { }
    favId: number; 

    getCats(): Observable<Cat[]> {
        this.messageService.add('CatService: fetched cats');
        return of(CATS);
    }

    getCat(id: number): Observable<Cat> {
        this.messageService.add('CatService: fetched cat with Id' + id);
        return of(CATS.filter(c => c.id === id)[0]);
    }

    selectAsFavourite(id: number) {
        this.favId = id;
    }

    getFavId() {
        return this.favId;
    }
}
