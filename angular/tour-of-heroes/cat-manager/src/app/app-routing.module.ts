import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatsComponent } from './cats/cats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatDetailComponent } from './cat-detail/cat-detail.component';
import { FavouriteComponent } from './favourite/favourite.component';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'cats', component: CatsComponent },
    { path: 'detail/:id', component: CatDetailComponent },
    { path: 'favourite', component: FavouriteComponent },
    { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
