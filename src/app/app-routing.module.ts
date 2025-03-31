import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'movies', 
    loadComponent: () => import('./movies/movies.component').then(m => m.MoviesComponent)
  },
  { 
    path: 'actors', 
    loadComponent: () => import('./actors/actors.component').then(m => m.ActorsComponent)
  },
  { 
    path: '', redirectTo: '/movies', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
