import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { CatService } from '../cat.service';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})

export class CreateNewComponent implements OnInit {

    constructor(private router: Router,
        private catService: CatService) { }

    ngOnInit() {
    }

    createCat(name: string, fur: string): void {
        if (name.length && fur.length) {
            this.catService.postCat(name, fur).subscribe();
            this.router.navigate(['/cats']);
        } 
    }
}
