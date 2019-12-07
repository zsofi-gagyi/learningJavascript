import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Cat } from './cat';
import { CatWithoutId } from './catWithoutId';
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
        //a STREAM of results, but in this case, it will be a stream of 1 array
        //for a real stream, the backend would need to really do send them one by one
        return this.http.get<Cat[]>(this.catsUrl + "/all")
            .pipe(
                tap(_ => this.log('fetched cats')),
                //do this every time (even when there is a problem)
                //and let the information itself advance further
                //down the pipe,
                catchError(this.handleError<Cat[]>('getCats', []))
                //catch errors and return a default when relevant,
                //otherwise return the correct result itself
        );
    }

    //GET ONE
    getCat(id: number): Observable<Cat> {
        return this.http.get<Cat>(this.catsUrl + "/" + id)
            .pipe(
                tap(_ => this.log("fetched cat with Id " + id)),
                catchError(this.handleError<Cat>('getCat', new Cat("", "")))
        );
    }

    //GET with PARAMETERS = SEARCH
    searchCats(name: string, fur: string): Observable<Cat[]> {

        if (!name.trim() && !fur.trim()) {
            // refuse searching for empty terms
            return of([]);
        }

        let url = this.createUrlWithSearchTerms(name, fur);
        console.log("url " + url);

        return this.http.get<Cat[]>(url).pipe(
            tap(_ => {
                if (name.trim() && fur.trim()) {
                    this.log(`found cats with name containing "${name}" and fur containing "${fur}"`);
                    return;
                }
                
                if (name.trim()) {
                    this.log(`found cats with name containing "${name}"`);
                }

                if (fur.trim()) {
                    this.log(`found cats with fur containing "${fur}"`);
                } 
            }),
            catchError(this.handleError<Cat[]>('searchCats', []))
        );
    }

    createUrlWithSearchTerms(name: string, fur: string): string {
        let url = this.catsUrl;

        if (name.trim()) {
            url += "/?name=" + name;

            if (fur.trim()) {
                url += "&fur=" + fur;
            }
        } else {
            if (fur.trim()) {
                url += "/?fur=" + fur;
            }
        }

        return url;
    }

    //POST
    postCat(name: string, fur: string): Observable<any> {
        const newCat = new CatWithoutId(name, fur);
        return this.http.post(this.catsUrl, newCat, this.httpOptions)
            .pipe(
                tap(_ => this.log("saved cat with name: " + name + " and fur: " + fur)),
                catchError(this.handleError<Cat>('postCat'))
        );
    }

    //PUT
    updateCat(cat: Cat): Observable<any> {
        return this.http.put(this.catsUrl, cat, this.httpOptions)
            .pipe(
                tap(_ => this.log("updated cat with Id " + cat.id)),
                catchError(this.handleError<Cat>('postCat'))
        );
    }

    //DELETE
    delete(id: number): Observable<any>{
        return this.http.delete(this.catsUrl + "/" + id)
            .pipe(
                tap(_ => this.log("deleted cat with Id " + id)),
                catchError(this.handleError<Cat>('deleteCat'))
            );
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

    /**
     * AS COPIED FROM THE TUTORIAL
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
