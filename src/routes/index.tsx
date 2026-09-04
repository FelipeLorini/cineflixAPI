// Página inicial: hero do filme #1 popular + carrossel e grids.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaInfoCircle, FaRegHeart } from "react-icons/fa";
import { movieService, type Movie } from "@/services/movieService";
import { imageUrl } from "@/services/api";
import { MovieCard } from "@/components/common/MovieCard";
import { MovieCarousel } from "@/components/common/MovieCarousel";
import { MovieSkeleton } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { RatingStars } from "@/components/common/RatingStars";
import { useFavorites } from "@/context/FavoritesContext";
import { year } from "@/utils/helpers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineFlix — Filmes populares, em cartaz e lançamentos" },
      {
        name: "description",
        content:
          "Página inicial do CineFlix: destaque do momento, melhores avaliados, filmes em cartaz e próximos lançamentos.",
      },
      { property: "og:title", content: "CineFlix — Catálogo de Filmes" },
      {
        property: "og:description",
        content: "Explore os filmes mais populares do momento com dados do TMDB.",
      },
    ],
  }),
  component: Home,
});

function useCategory(category: Parameters<typeof movieService.list>[0]) {
  return useQuery({
    queryKey: ["movies", category, 1],
    queryFn: () => movieService.list(category),
  });
}

function Home() {
  const popular = useCategory("popular");
  const topRated = useCategory("top_rated");
  const nowPlaying = useCategory("now_playing");
  const upcoming = useCategory("upcoming");
  const { isFavorite, toggleFavorite } = useFavorites();

  const featured = popular.data?.results?.[0];

  return (
    <div className="pb-10">
      {/* Hero Banner */}
      {popular.isLoading && (
        <div className="h-[70vh] w-full animate-pulse bg-card" />
      )}
      {popular.isError && (
        <div className="px-4 py-16">
          <ErrorMessage
            message={(popular.error as Error).message}
            onRetry={() => popular.refetch()}
          />
        </div>
      )}
      {featured && (
        <section className="relative min-h-[70vh] w-full overflow-hidden">
          {imageUrl(featured.backdrop_path, "original") && (
            <img
              src={imageUrl(featured.backdrop_path, "original")!}
              alt={`Cena do filme ${featured.title}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          )}
          <div className="hero-fade absolute inset-0" />
          <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end gap-4 px-4 pb-14 pt-24">
            <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Destaque do momento
            </span>
            <h1 className="animate-rise max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
              {featured.title}
            </h1>
            <div className="flex items-center gap-4">
              <RatingStars value={featured.vote_average} size={16} />
              <span className="text-sm text-muted-foreground">
                {year(featured.release_date)}
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {featured.overview || "Sinopse não disponível em português."}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                to="/filme/$id"
                params={{ id: String(featured.id) }}
                className="gradient-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                <FaInfoCircle /> Ver detalhes
              </Link>
              <button
                onClick={() =>
                  toggleFavorite({
                    id: featured.id,
                    title: featured.title,
                    poster_path: featured.poster_path,
                    vote_average: featured.vote_average,
                    release_date: featured.release_date,
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-bold backdrop-blur transition-colors hover:border-primary hover:text-primary"
              >
                {isFavorite(featured.id) ? <FaHeart /> : <FaRegHeart />} Favoritar
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl space-y-16 px-4 pt-16">
        <Section
          title="Melhores Avaliados"
          moreTo="top_rated"
          loading={topRated.isLoading}
          error={topRated.isError ? (topRated.error as Error).message : undefined}
          onRetry={() => topRated.refetch()}
        >
          <MovieCarousel movies={topRated.data?.results ?? []} />
        </Section>

        <Section
          title="Em Cartaz"
          moreTo="now_playing"
          loading={nowPlaying.isLoading}
          error={nowPlaying.isError ? (nowPlaying.error as Error).message : undefined}
          onRetry={() => nowPlaying.refetch()}
        >
          <Grid movies={(nowPlaying.data?.results ?? []).slice(0, 8)} />
        </Section>

        <Section
          title="Próximos Lançamentos"
          moreTo="upcoming"
          loading={upcoming.isLoading}
          error={upcoming.isError ? (upcoming.error as Error).message : undefined}
          onRetry={() => upcoming.refetch()}
        >
          <Grid movies={(upcoming.data?.results ?? []).slice(0, 8)} />
        </Section>
      </div>
    </div>
  );
}

function Grid({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}

function Section({
  title,
  moreTo,
  loading,
  error,
  onRetry,
  children,
}: {
  title: string;
  moreTo: "popular" | "now_playing" | "upcoming" | "top_rated";
  loading: boolean;
  error?: string | undefined;
  onRetry: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        <Link
          to="/filmes"
          search={{ categoria: moreTo }}
          className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
        >
          Ver Mais
        </Link>
      </div>
      {loading ? (
        <MovieSkeleton count={4} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={onRetry} />
      ) : (
        children
      )}
    </section>
  );
}
