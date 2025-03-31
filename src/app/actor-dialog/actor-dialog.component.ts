import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actor } from '../shared/models/actor.model';
import { ActorsService } from '../shared/services/actors.service';

export interface DialogData {
  actor: Actor;
}

@Component({
  selector: 'app-actor-dialog',
  standalone: true,
  templateUrl: './actor-dialog.component.html',
  imports: [
    ReactiveFormsModule
  ]
})
export class ActorDialogComponent {
  public data: DialogData = inject<DialogData>(MAT_DIALOG_DATA);
  private actorsService = inject(ActorsService);
  private dialogRef = inject(MatDialogRef<ActorDialogComponent>);

  public isSubmitted = false;

  public formGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
  });

  async add() {
    this.isSubmitted = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const newActor = await this.actorsService.createActor(this.formGroup.value as Partial<Actor>);
      this.dialogRef.close(newActor);
    }
  }
}
