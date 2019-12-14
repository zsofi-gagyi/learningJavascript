import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FixedTimeStepVersionComponent } from './components/fixed-time-version/fixed-time-version.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { VariableTimeStepVersionComponent } from './components/variable-time-version/variable-time-version.component';
import { GameAreaComponent } from './child-components/game-area/game-area.component';

@NgModule({
  declarations: [
    AppComponent,
    FixedTimeStepVersionComponent,
    MainPageComponent,
    VariableTimeStepVersionComponent,
    GameAreaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
