import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './components/main-page/main-page.component';
import { FixedTimeStepVersionComponent } from './components/fixed-time-version/fixed-time-version.component';
import { VariableTimeStepVersionComponent } from './components/variable-time-version/variable-time-version.component';

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
