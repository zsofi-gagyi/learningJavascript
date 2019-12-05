import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { PureAngularVersionComponent } from './pure-angular-version/pure-angular-version.component';
import { RxJsWithAngularVersionComponent } from './rx-js-with-angular-version/rx-js-with-angular-version.component';

const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: 'angularVersion', component: PureAngularVersionComponent },
    { path: 'rxJsVersion', component: RxJsWithAngularVersionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
