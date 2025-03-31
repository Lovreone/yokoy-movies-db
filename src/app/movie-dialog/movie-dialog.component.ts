import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actor } from '../shared/models/actor.model';
import { ActorsService } from '../shared/services/actors.service';
import { Movie, MovieDialogOutput } from '../shared/models/movie.model';
import { MoviesService } from '../shared/services/movies.service';
import { NgFor, NgIf } from '@angular/common';
import { MovieDialogAction } from '../shared/helpers/enums';

export interface DialogData {
  movie: Movie;
}

@Component({
  selector: 'app-movie-dialog',
  standalone: true,
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss'],
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule
  ]
})
export class MovieDialogComponent implements OnInit {
  public data: DialogData = inject<DialogData>(MAT_DIALOG_DATA);
  private moviesService = inject(MoviesService);
  private actorsService = inject(ActorsService);
  private dialogRef = inject(MatDialogRef<MovieDialogComponent>);

  public actors: Actor[] = [];
  
  public movieRatings = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

  public isSubmitted = false;

  public formGroup = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    year: new FormControl<number | null>(null, [Validators.min(1922), Validators.max(9999)]),
    rate: new FormControl<number | null>(null, [Validators.min(1), Validators.max(10)]),
    actors: new FormControl<string[]>([], []),
  });

  async ngOnInit(): Promise<void> {
    this.formGroup.patchValue({ ...this.data.movie });
    this.actors = await this.actorsService.getActors();
  }

  /**
   * Create or update movie 
   */
  async submit(): Promise<void> {
    this.isSubmitted = true;
    this.formGroup.markAllAsTouched();
    let outputData: MovieDialogOutput;
    if (this.formGroup.valid) {
      if (this.data.movie?.id) {
        // Updating a movie
        const updatedMovie = await this.moviesService.updateMovie(
          this.data.movie.id.toString(),
          this.formGroup.value as any
        );
        outputData = { action: MovieDialogAction.Update, movie: updatedMovie }; 
      } else {
        const createdMovie = await this.moviesService.createMovie(this.formGroup.value as any);
        outputData = { action: MovieDialogAction.Create, movie: createdMovie };
      }
      this.dialogRef.close(outputData);
    }
  }

  async delete(): Promise<void> {
    if (confirm('You are about to permanently delete this item. Are you sure?') !== true) {
      return;
    }
    await this.moviesService.deleteMovie(this.data.movie.id.toString());
    this.dialogRef.close({ action: MovieDialogAction.Delete, movie: this.data.movie });
  }
}
