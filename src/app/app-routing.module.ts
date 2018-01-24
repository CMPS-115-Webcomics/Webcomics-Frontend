import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComicsComponent } from './comics/comics.component';
import { ComicViewComponent } from'./comic-view/comic-view.component';

const routes: Routes = [
    { path: 'comics', component: ComicsComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
