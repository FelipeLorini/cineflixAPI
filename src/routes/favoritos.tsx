// Página de favoritos (protegida) com remoção e compartilhamento da lista.
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FaShareAlt, FaCopy } from "react-icons/fa";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { MovieCard } from "@/components/common/MovieCard";
import { useFavorites } from "@/context/FavoritesContext";

export const Route = createFileRoute("/favoritos")({
  validateSearch: (search: Record<string, unknown>) => ({
    ids: typeof search["ids"] === "string" ? search["ids"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Meus Favoritos | CineFlix" },
      {
        name: "description",
        content:
          "Sua lista pessoal de filmes favoritos no CineFlix: remova itens e compartilhe com amigos.",
      },
      { property: "og:title", content: "Meus Favoritos | CineFlix" },
      {
        property: "og:description",
        content: "Gerencie e compartilhe sua lista de filmes favoritos.",
      },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ProtectedRoute>
        <FavoritesPage />
      </ProtectedRoute>
    </div>
  ),
});

function FavoritesPage() {
  const { favorites, count, removeFavorite, shareText, shareUrl } = useFavorites();

  const share = async () => {
    const text = `${shareText()}\n\n${shareUrl()}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Meus favoritos no CineFlix", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Lista copiada para a área de transferência!");
      }
    } catch {
      toast.error("Não foi possível compartilhar a lista.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Meus Favoritos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {count} {count === 1 ? "filme salvo" : "filmes salvos"} neste navegador.
          </p>
        </div>
        {count > 0 && (
          <div className="flex gap-3">
            <button
              onClick={share}
              className="gradient-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <FaShareAlt size={12} /> Compartilhar lista
            </button>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(shareUrl());
                toast.success("Link copiado!");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
            >
              <FaCopy size={12} /> Copiar link
            </button>
          </div>
        )}
      </div>

      {count === 0 ? (
        <div className="mt-16 rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Você ainda não favoritou nenhum filme.
          </p>
          <Link
            to="/filmes"
            className="gradient-cta mt-6 inline-block rounded-full px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((m) => (
            <MovieCard
              key={m.id}
              movie={{ ...m, poster_path: m.poster_path }}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </>
  );
}
