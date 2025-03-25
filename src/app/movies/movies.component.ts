import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { movie } from "../movie.model";
import { moviesService } from "../movies.service";
import { MovieDialogComponent } from "./movie-dialog.component";

@Component({
  selector: "app-movies",
  templateUrl: "./movies.component.html",
  styleUrls: ["./movies.component.scss"],
})
export class MoviesComponent {
  movies: movie[] = [];
  filter: { title?: string; year?: number; rate?: number } = {};

  constructor(
    private moviesService: moviesService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const movies = await this.moviesService.getAll("1", this.filter);
    this.movies = movies;
  }

  preview(id: number) {
    const selectedMovie = this.movies.find((m) => m.id === id);
    this.dialog
      .open(MovieDialogComponent, {
        minWidth: "300px",
        data: { movie: selectedMovie },
      })
      .afterClosed()
      .subscribe(async () => {
        this.movies = await this.moviesService.getAll("1", this.filter);
      });
  }

  async delete(id: number) {
    await this.moviesService.delete(id.toString());
    const movies = await this.moviesService.getAll("1", this.filter);
    this.movies = movies;
  }

  add() {
    this.preview(0);
  }

  async onSearchChange(e: Event) {
    this.filter.title = (e.target as HTMLInputElement).value;
    this.movies = await this.moviesService.getAll("1", this.filter);
  }

  async onYearChange(e: Event) {
    this.filter.year = +(e.target as HTMLInputElement).value;
    this.movies = await this.moviesService.getAll("1", this.filter);
  }

  async onRateChange(e: Event) {
    this.filter.rate = +(e.target as HTMLInputElement).value;
    this.movies = await this.moviesService.getAll("1", this.filter);
  }
}
