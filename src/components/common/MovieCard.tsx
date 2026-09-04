// Card de filme com pôster, nota, ano e ações.
import { Link } from "@tanstack/react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { imageUrl } from "@/services/api";
import type { Movie } from "@/services/movieService";
import { useFavorites } from "@/context/FavoritesContext";
import { RatingStars } from "./RatingStars";
import { year } from "@/utils/helpers";

type Props = {
  movie: Pick<
    Movie,
    "id" | "title" | "poster_path" | "vote_average" | "release_date"
  >;
  onRemove?: (id: number) => void;
};

export function MovieCard({ movie, onRemove }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);
  const poster = imageUrl(movie.poster_path, "w500");

  return (
    <article className="group animate-rise overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60">
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary/40">
        {poster ? (
          <img
            src={poster}
            alt={`Pôster do filme ${movie.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
            Sem pôster disponível
          </div>
        )}

        <button
          type="button"
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={() =>
            onRemove
              ? onRemove(movie.id)
              : toggleFavorite({
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                })
          }
          className="absolute right-2 top-2 rounded-full bg-background/80 p-2 text-primary backdrop-blur transition-transform hover:scale-110"
        >
          {favorite || onRemove ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <RatingStars value={movie.vote_average} size={12} />
          <span className="text-xs text-muted-foreground">
            {year(movie.release_date)}
          </span>
        </div>
        <Link
          to="/filme/$id"
          params={{ id: String(movie.id) }}
          className="mt-1 block rounded-full bg-secondary px-3 py-2 text-center text-xs font-semibold text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Saiba Mais
        </Link>
      </div>
    </article>
  );
}
