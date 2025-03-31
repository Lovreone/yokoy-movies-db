import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActorDialogComponent } from './actor-dialog/actor-dialog.component';
import { ActorsComponent } from './actors/actors.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieDialogComponent } from './movie-dialog/movie-dialog.component';
import { MoviesComponent } from './movies/movies.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ActorsComponent,
    MoviesComponent,
    NavigationComponent,
    MovieDialogComponent,
    ActorDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
