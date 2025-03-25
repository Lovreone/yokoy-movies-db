import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { actor } from '../actor.model';
import { actorsService } from '../actors.service';
import { movie } from '../movie.model';
import { moviesService } from '../movies.service';

export interface DialogData {
  movie: movie;
}

@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss'],
})
export class MovieDialogComponent {
  public actors: actor[] = [];
  public submitted = false;
  public formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    year: new FormControl(0, []),
    actors: new FormControl([] as any, []),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private moviesService: moviesService,
    private actorsService: actorsService,
    private dialogRef: MatDialogRef<MovieDialogComponent>
  ) {
    this.formGroup.patchValue({ ...this.data.movie });
  }

  async ngOnInit() {
    this.actors = await this.actorsService.getAll('1');
  }

  async submit() {
    this.submitted = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      if (this.data.movie?.id) {
        await this.moviesService.edit(
          this.data.movie.id.toString(),
          this.formGroup.value as any
        );
      } else {
        await this.moviesService.create(this.formGroup.value as any);
      }
      this.dialogRef.close();
    }
  }

  async delete() {
    await this.moviesService.delete(this.data.movie.id.toString());
    this.dialogRef.close();
  }
}
