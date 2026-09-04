// Detalhes do filme: backdrop, sinopse, elenco, trailer, avaliação, favorito e comentários.
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaRegHeart, FaClock, FaCalendarAlt } from "react-icons/fa";
import { movieService } from "@/services/movieService";
import { imageUrl } from "@/services/api";
import { RatingStars } from "@/components/common/RatingStars";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { CommentForm } from "@/components/forms/CommentForm";
import { useFavorites } from "@/context/FavoritesContext";
import { formatDate, runtimeLabel } from "@/utils/helpers";

export const Route = createFileRoute("/filme/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do filme | CineFlix" },
      {
        name: "description",
        content:
          "Sinopse, elenco principal, trailer, avaliação e comentários do filme selecionado no CineFlix.",
      },
      { property: "og:title", content: "Detalhes do filme | CineFlix" },
      {
        property: "og:description",
        content: "Veja sinopse, elenco, trailer e comentários deste filme.",
      },
    ],
  }),
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { id } = Route.useParams();
  const movieId = Number(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  const detail = useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieService.detail(id),
  });
  const credits = useQuery({
    queryKey: ["credits", id],
    queryFn: () => movieService.credits(id),
  });
  const videos = useQuery({
    queryKey: ["videos", id],
    queryFn: () => movieService.videos(id),
  });

  if (detail.isLoading) return <LoadingSpinner label="Carregando filme..." />;
  if (detail.isError || !detail.data)
    return (
      <div className="px-4 py-20">
        <ErrorMessage
          message={(detail.error as Error)?.message ?? "Filme não encontrado."}
          onRetry={() => detail.refetch()}
        />
      </div>
    );

  const movie = detail.data;
  const favorite = isFavorite(movie.id);
  const trailer =
    videos.data?.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
    ) ?? videos.data?.results.find((v) => v.site === "YouTube");
  const cast = (credits.data?.cast ?? []).slice(0, 5);
  const progress = Math.round((movie.vote_average / 10) * 100);

  return (
    <article className="pb-16">
      {/* Banner */}
      <section className="relative min-h-[60vh] w-full overflow-hidden">
        {imageUrl(movie.backdrop_path, "original") && (
          <img
            src={imageUrl(movie.backdrop_path, "original")!}
            alt={`Cena do filme ${movie.title}`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}
        <div className="hero-fade absolute inset-0" />

        <div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end gap-8 px-4 pb-12 pt-28 md:flex-row md:items-end">
          {imageUrl(movie.poster_path, "w500") && (
            <img
              src={imageUrl(movie.poster_path, "w500")!}
              alt={`Pôster de ${movie.title}`}
              className="animate-rise w-40 shrink-0 rounded-2xl border border-border shadow-glow md:w-56"
            />
          )}

          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold md:text-5xl">{movie.title}</h1>
            {movie.tagline && (
              <p className="italic text-muted-foreground">“{movie.tagline}”</p>
            )}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <RatingStars value={movie.vote_average} size={16} />
              <span className="inline-flex items-center gap-2">
                <FaCalendarAlt size={12} /> {formatDate(movie.release_date)}
              </span>
              <span className="inline-flex items-center gap-2">
                <FaClock size={12} /> {runtimeLabel(movie.runtime)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <button
              onClick={() =>
                toggleFavorite({
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                })
              }
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-105 ${
                favorite
                  ? "gradient-cta text-primary-foreground"
                  : "border border-border bg-background/60 backdrop-blur"
              }`}
            >
              {favorite ? <FaHeart /> : <FaRegHeart />}
              {favorite ? "Nos favoritos" : "Favoritar"}
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-12">
        {/* Sinopse + avaliação */}
        <section className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-xl font-bold">Sinopse</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {movie.overview || "Sinopse não disponível em português."}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Avaliação do público
            </h2>
            <p className="mt-2 text-4xl font-extrabold text-primary">
              {movie.vote_average.toFixed(1)}
              <span className="text-base text-muted-foreground">/10</span>
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="gradient-cta h-full rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {movie.vote_count.toLocaleString("pt-BR")} votos no TMDB
            </p>
          </div>
        </section>

        {/* Elenco */}
        <section>
          <h2 className="text-xl font-bold">Elenco principal</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[2/3] bg-secondary/40">
                  {imageUrl(actor.profile_path, "w300") ? (
                    <img
                      src={imageUrl(actor.profile_path, "w300")!}
                      alt={actor.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Sem foto
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold">{actor.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
            {!cast.length && (
              <p className="text-sm text-muted-foreground">Elenco não disponível.</p>
            )}
          </div>
        </section>

        {/* Trailer */}
        <section>
          <h2 className="text-xl font-bold">Trailer</h2>
          {trailer ? (
            <div className="mt-5 aspect-video w-full overflow-hidden rounded-2xl border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`Trailer de ${movie.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nenhum trailer disponível para este filme.
            </p>
          )}
        </section>

        <CommentForm movieId={movieId} />
      </div>
    </article>
  );
}
