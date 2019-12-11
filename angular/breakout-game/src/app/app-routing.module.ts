import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { FixedTimeStepVersionComponent } from './fixed-time-version/fixed-time-version.component';
import { VariableTimeStepVersionComponent } from './variable-time-version/variable-time-version.component';

const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: 'fixedTimeStepVersion', component: FixedTimeStepVersionComponent },
    { path: 'variableTimeStepVersion', component: VariableTimeStepVersionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
