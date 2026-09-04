// Constantes compartilhadas da aplicação.
import type { Category } from "@/services/movieService";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "popular", label: "Populares" },
  { key: "now_playing", label: "Em Cartaz" },
  { key: "upcoming", label: "Lançamentos" },
  { key: "top_rated", label: "Top Rated" },
];

export const STORAGE_KEYS = {
  users: "cineflix:users",
  session: "cineflix:session",
  favorites: "cineflix:favorites",
  comments: "cineflix:comments",
};

export const PAGE_SIZE = 20;

export const YEARS = Array.from(
  { length: 36 },
  (_, i) => `${new Date().getFullYear() - i}`,
);
