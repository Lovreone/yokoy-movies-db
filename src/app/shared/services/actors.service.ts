import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Actor } from '../models/actor.model';

@Injectable({ providedIn: 'root' })
export class ActorsService {
  private http = inject(HttpClient);

  private readonly basePath = 'http://localhost:3000/actors';

  public getActors(filter?: { name: string }): Promise<Actor[]> {
    let url = this.basePath;
    if (filter?.name) {
      url += `?name_like=${filter.name}`;
    }
    return firstValueFrom(this.http.get<Actor[]>(url));
  }

  // Unused but can be used in the future
  public getActorById(id: string): Promise<Actor> {
    return firstValueFrom(
      this.http.get<Actor>(`${this.basePath}/${id}`)
    );
  }

  public createActor(actor: Partial<Actor>): Promise<Actor> {
    return firstValueFrom(
      this.http.post<Actor>(this.basePath, actor)
    );
  }
}
