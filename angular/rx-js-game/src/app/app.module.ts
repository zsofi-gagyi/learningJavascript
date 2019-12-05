import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PureAngularVersionComponent } from './pure-angular-version/pure-angular-version.component';
import { RxJsWithAngularVersionComponent } from './rx-js-with-angular-version/rx-js-with-angular-version.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PureAngularVersionComponent,
    RxJsWithAngularVersionComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
