import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Movie, MovieFilter, MovieDialogOutput } from '../shared/models/movie.model';
import { MoviesService } from '../shared/services/movies.service';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, NgFor } from '@angular/common';
import { MovieDialogAction, MovieFilterField } from '../shared/helpers/enums';

@Component({
  selector: 'app-movies',
  standalone: true,
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  imports: [
    NgFor, 
    AsyncPipe,
    MatDialogModule
  ]
})
export class MoviesComponent implements OnInit {
  private moviesService = inject(MoviesService);
  private dialog = inject(MatDialog); 

  public MovieFilterField = MovieFilterField;

  private filter: MovieFilter = {};

  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  private filteredMoviesSubject = new BehaviorSubject<Movie[]>([]);
  public movies$ = this.filteredMoviesSubject.asObservable();
 
  public async ngOnInit(): Promise<void> {
    const movies = await this.moviesService.getMovies(this.filter);
    this.moviesSubject.next(movies);
    this.filteredMoviesSubject.next(movies);
  }

  public openMovieDialogue(id: number): void {
    const selectedMovie = this.moviesSubject.value.find((m) => m.id === id);
    this.dialog
      .open(MovieDialogComponent, {
        minWidth: '380px',
        data: { movie: selectedMovie },
      })
      .afterClosed()
      .subscribe(async (outputData: MovieDialogOutput) => {
        // Dialogue modal canceled/closed
        if (!outputData) {
          return;
        }
        
        // Updating movies list after latest changes
        let updatedMovies: Movie[] = [];
        if (outputData.action === MovieDialogAction.Create) {
          updatedMovies = [...this.moviesSubject.value, outputData.movie];
        }
        if (outputData.action === MovieDialogAction.Update) {
          updatedMovies = this.moviesSubject.value.map((m) => {
            return m.id === outputData.movie.id ? outputData.movie : m
          });
        }
        if (outputData.action === MovieDialogAction.Delete) {
          updatedMovies = this.moviesSubject.value.filter((m) => {
            return m.id !== outputData.movie.id
          });
        }

        this.updateMoviesList(updatedMovies);
      });
  }

  public addNewMovie(): void {
    this.openMovieDialogue(0);
  }


  public async deleteMovie(id: number): Promise<void> {
    if (confirm('You are about to permanently delete this item. Are you sure?') !== true) {
      return;
    }
    await this.moviesService.deleteMovie(id.toString());

    // Updating movies list post deletion
    const updatedMovies = this.moviesSubject.value.filter((m) => m.id !== id);
    this.updateMoviesList(updatedMovies);
  }

  /**
   * Updates filters using filter inputs in the UI
   */
  public async updateFilter(field: MovieFilterField, event: Event): Promise<void> {
    const value = (event.target as HTMLInputElement).value;

    if (field === MovieFilterField.Title) {
      this.filter.title = value;
    } else if (field === MovieFilterField.Year) {
      this.filter.year = +value || undefined;
    } else if (field === MovieFilterField.Rate) {
      this.filter.rate = +value || undefined;
    }
    
    this.applyMovieFilters();
  }

  /**
   * Applies all existing filters to list of current movies
   */
  private applyMovieFilters(): void {
    const allCurrentMovies = this.moviesSubject.value;
    const filteredMovies = allCurrentMovies.filter((movie) => {
      return (
        (!this.filter.title || movie.title?.toLowerCase().includes(this.filter.title?.toLowerCase())) &&
        (!this.filter.year || +movie.year === this.filter.year) &&
        (!this.filter.rate || movie.rate === this.filter.rate)
      );
    });
    this.filteredMoviesSubject.next(filteredMovies);
  }

  /**
   * Updates movie list Subjects with latest state, and re-applies filters 
   * to the updated lists to keep list in filtered state even after list changes
   */
  private updateMoviesList(updatedMovies: Movie[]): void {
    this.moviesSubject.next(updatedMovies);
    this.filteredMoviesSubject.next(updatedMovies);
    this.applyMovieFilters();
  }
}
