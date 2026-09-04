// Serviço de acesso aos endpoints de filmes do TMDB.
import { getCached } from "./api";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids?: number[];
};

export type MovieList = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type MovieDetail = Movie & {
  runtime: number | null;
  tagline: string | null;
  status: string;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type Category = "popular" | "now_playing" | "upcoming" | "top_rated";

export const movieService = {
  list: (category: Category, page = 1) =>
    getCached<MovieList>(`/movie/${category}`, { page }),

  detail: (id: number | string) => getCached<MovieDetail>(`/movie/${id}`),

  credits: (id: number | string) =>
    getCached<{ cast: CastMember[] }>(`/movie/${id}/credits`),

  videos: (id: number | string) =>
    getCached<{ results: Video[] }>(`/movie/${id}/videos`),

  search: (query: string, page = 1) =>
    getCached<MovieList>("/search/movie", { query, page }),

  genres: () =>
    getCached<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),

  discover: (params: {
    page?: number;
    with_genres?: string;
    primary_release_year?: string;
    sort_by?: string;
  }) => getCached<MovieList>("/discover/movie", params),
};
