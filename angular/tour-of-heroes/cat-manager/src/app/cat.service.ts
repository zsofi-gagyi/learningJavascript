import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Cat } from './cat';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class CatService {

    //"favourite cat" is session-specific and is not saved on the server
    favId: number;

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    private catsUrl = "http://localhost:51595/api/cats";  

    constructor(private http: HttpClient,
                private messageService: MessageService) { }

    //GET ALL
    getCats(): Observable<Cat[]> {
        this.log("fetched cats");
        return this.http.get<Cat[]>(this.catsUrl + "/all");
    }

    //GET ONE
    getCat(id: number): Observable<Cat> {
        this.log("fetched cat with Id " + id);
        return this.http.get<Cat>(this.catsUrl + "/" + id);
    }

    //POST
    postCat(name: string, fur: string): Observable<any> {
        this.log("saved cat with name: " + name + " and fur: " + fur);
        const newCat = new Cat(name, fur);
        return this.http.post(this.catsUrl, newCat, this.httpOptions);
    }

    //PUT
    updateCat(cat: Cat): Observable<any> {
        this.log("updated cat with Id " + cat.id);
        return this.http.put(this.catsUrl, cat, this.httpOptions);
    }

    //DELETE
    delete(id: number): Observable<any>{
        this.log("deleted cat with Id " + id);
        return this.http.delete(this.catsUrl + "/" + id);
    }

    //strictly local operation
    selectAsFavourite(id: number) {
        this.log('the cat with Id ' + id + ' was chosen as favourite');
        this.favId = id;
    }

    //strictly local operation
    getFavId() {
        return this.favId;
    }

    log(message: string) {
        this.messageService.add("CatService: " + message);
    }
}
