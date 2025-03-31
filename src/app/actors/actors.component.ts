import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Actor } from '../shared/models/actor.model';
import { ActorsService } from '../shared/services/actors.service';
import { ActorDialogComponent } from '../actor-dialog/actor-dialog.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-actors',
  standalone: true,
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.scss'],
  imports: [
    NgFor,
    MatDialogModule
  ]
})
export class ActorsComponent implements OnInit {
  private actorsService = inject(ActorsService);
  private dialog = inject(MatDialog);
  
  private actors: WritableSignal<Actor[]> = signal([]);
  private searchQuerry: WritableSignal<string> = signal('');
  public filteredActors: Signal<Actor[]> = computed(() => {
    return this.actors().filter((a) => {
      return a.name.toLowerCase().includes(this.searchQuerry().toLowerCase())}
    )
  });

  public isTrue = true;

  public async ngOnInit(): Promise<void> {
    const actors = await this.actorsService.getActors();
    this.actors.set(actors);
  }

  public async onSearchChange(e: Event): Promise<void> {
    const searchQuery = (e.target as HTMLInputElement).value;
    this.searchQuerry.set(searchQuery);
  }

  public openActorDialog(): void {
    this.dialog
      .open(ActorDialogComponent, {
        minWidth: '300px',
      })
      .afterClosed()
      .subscribe(async (actor: Actor) => {
        if (!actor) {
          // Dialogue modal canceled/closed
          return;
        } else {
          // New actor was created
          this.actors.set([...this.actors(), actor]);
        }
      });
  }
}
