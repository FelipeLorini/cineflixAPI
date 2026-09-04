// Carrossel horizontal de filmes com controles de rolagem.
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Movie } from "@/services/movieService";
import { MovieCard } from "./MovieCard";

export function MovieCarousel({ movies }: { movies: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={ref}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-[160px] shrink-0 snap-start md:w-[200px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {[-1, 1].map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={dir === -1 ? "Rolar para a esquerda" : "Rolar para a direita"}
          onClick={() => scroll(dir as 1 | -1)}
          className={`absolute top-1/2 hidden -translate-y-1/2 rounded-full border border-border bg-background/90 p-3 text-foreground backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground md:block ${
            dir === -1 ? "-left-4" : "-right-4"
          }`}
        >
          {dir === -1 ? <FaChevronLeft size={14} /> : <FaChevronRight size={14} />}
        </button>
      ))}
    </div>
  );
}
