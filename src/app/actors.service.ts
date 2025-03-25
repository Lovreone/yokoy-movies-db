import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { actor } from './actor.model';

@Injectable({ providedIn: 'root' })
export class actorsService {
  constructor(private http: HttpClient) {}

  getAll(page: string, filter?: { name: string }): Promise<actor[]> {
    let url = 'http://localhost:3000/actors';
    if (filter?.name) {
      url += `?name_like=${filter.name}`;
    }
    return firstValueFrom(this.http.get(url)) as any;
  }

  getSingle(id: string): Promise<actor> {
    return firstValueFrom(
      this.http.get('http://localhost:3000/actors/' + id)
    ) as any;
  }

  create(actor: Partial<actor>): Promise<actor> {
    return firstValueFrom(
      this.http.post('http://localhost:3000/actors', actor)
    ) as any;
  }
}
