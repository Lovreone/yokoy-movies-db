import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Movie, MovieFilter } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private http = inject(HttpClient);

  private readonly basePath = 'http://localhost:3000/movies';

  public getMovies(
    filter: MovieFilter
  ): Promise<Movie[]> {
    let url = this.basePath;
    Object.entries(filter)
      .filter(([key, value]) => !!value)
      .forEach(([key, value], index) => {
        const prefix = index === 0 ? '?' : '&';
        switch (key) {
          case 'title':
            url += `${prefix}title_like=${value}`;
            break;
          case 'year':
            url += `${prefix}year=${value}`;
            break;
          case 'rate':
            url += `${prefix}rate=${value}`;
            break;
        }
      });

    return firstValueFrom(this.http.get<Movie[]>(url));
  }

  // Unused but can stay for future use
  public getMovieById(id: string): Promise<Movie> {
    return firstValueFrom(
      this.http.get<Movie>(`${this.basePath}/${id}`)
    );
  }

  public createMovie(movie: Partial<Movie>): Promise<Movie> {
    return firstValueFrom(
      this.http.post<Movie>(this.basePath, movie)
    );
  }

  public updateMovie(id: string, movie: Partial<Movie>): Promise<Movie> {
    return firstValueFrom(
      this.http.patch<Movie>(`${this.basePath}/${id}`, movie)
    );
  }

  public deleteMovie(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.basePath}/${id}`)
    );
  }
}
