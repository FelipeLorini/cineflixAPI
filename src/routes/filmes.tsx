// Catálogo com filtros (categoria, ano, gênero), busca e carregamento infinito.
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { movieService, type Category } from "@/services/movieService";
import { MovieCard } from "@/components/common/MovieCard";
import { MovieSkeleton } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { CATEGORIES, YEARS } from "@/utils/constants";

type Search = {
  categoria?: Category;
  q?: string;
  ano?: string;
  genero?: string;
};

export const Route = createFileRoute("/filmes")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    categoria: (["popular", "now_playing", "upcoming", "top_rated"] as const).includes(
      search["categoria"] as Category,
    )
      ? (search["categoria"] as Category)
      : "popular",
    q: typeof search["q"] === "string" ? search["q"] : "",
    ano: typeof search["ano"] === "string" ? search["ano"] : "",
    genero: typeof search["genero"] === "string" ? search["genero"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Filmes — Catálogo completo | CineFlix" },
      {
        name: "description",
        content:
          "Explore o catálogo de filmes do CineFlix com filtros por categoria, ano e gênero, além de busca por título.",
      },
      { property: "og:title", content: "Filmes — Catálogo completo | CineFlix" },
      {
        property: "og:description",
        content: "Filtre por categoria, ano e gênero e descubra seu próximo filme.",
      },
    ],
  }),
  component: Movies,
});

function Movies() {
  const { categoria = "popular", q = "", ano = "", genero = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/filmes" });

  const setSearch = (patch: Search) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }) });

  const genres = useQuery({ queryKey: ["genres"], queryFn: movieService.genres });

  const query = useInfiniteQuery({
    queryKey: ["catalog", categoria, q, ano, genero],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      if (q.trim()) return movieService.search(q.trim(), pageParam);
      if (ano || genero)
        return movieService.discover({
          page: pageParam,
          ...(genero ? { with_genres: genero } : {}),
          ...(ano ? { primary_release_year: ano } : {}),
          sort_by: categoria === "top_rated" ? "vote_average.desc" : "popularity.desc",
        });
      return movieService.list(categoria, pageParam);
    },
    getNextPageParam: (last) =>
      last.page < Math.min(last.total_pages, 500) ? last.page + 1 : undefined,
  });

  const movies = query.data?.pages.flatMap((p) => p.results) ?? [];
  const activeLabel = q.trim()
    ? `Resultados para "${q}"`
    : CATEGORIES.find((c) => c.key === categoria)?.label ?? "Filmes";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">{activeLabel}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {query.data?.pages[0]?.total_results ?? 0} filmes encontrados • 20 por
        carregamento
      </p>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Select
          label="Categoria"
          value={categoria}
          onChange={(v) => setSearch({ categoria: v as Category })}
          options={CATEGORIES.map((c) => ({ value: c.key, label: c.label }))}
        />
        <Select
          label="Ano"
          value={ano}
          onChange={(v) => setSearch({ ano: v })}
          options={[
            { value: "", label: "Todos" },
            ...YEARS.map((y) => ({ value: y, label: y })),
          ]}
        />
        <Select
          label="Gênero"
          value={genero}
          onChange={(v) => setSearch({ genero: v })}
          options={[
            { value: "", label: "Todos" },
            ...(genres.data?.genres ?? []).map((g) => ({
              value: String(g.id),
              label: g.name,
            })),
          ]}
        />
        {(q || ano || genero) && (
          <button
            onClick={() => setSearch({ q: "", ano: "", genero: "" })}
            className="self-end rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="mt-8">
        {query.isLoading ? (
          <MovieSkeleton count={12} />
        ) : query.isError ? (
          <ErrorMessage
            message={(query.error as Error).message}
            onRetry={() => query.refetch()}
          />
        ) : movies.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhum filme encontrado com estes filtros.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {movies.map((m, i) => (
                <MovieCard key={`${m.id}-${i}`} movie={m} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              {query.hasNextPage ? (
                <button
                  onClick={() => query.fetchNextPage()}
                  disabled={query.isFetchingNextPage}
                  className="gradient-cta rounded-full px-8 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60"
                >
                  {query.isFetchingNextPage ? "Carregando..." : "Carregar mais"}
                </button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Você chegou ao fim da lista.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-36 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-card">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
