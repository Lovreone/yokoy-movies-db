import { MovieDialogAction } from "../helpers/enums";

export interface Movie {
  id: number;
  title: string;
  year: number;
  rate: number | null;
  actors: string[];
}

export interface MovieFilter {
  title?: string;
  year?: number;
  rate?: number;
}

export interface MovieDialogOutput {
  action: MovieDialogAction;
  movie: Movie;
}
