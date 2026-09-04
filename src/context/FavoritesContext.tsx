// Contexto de favoritos: exige usuário logado e persiste por usuário.
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/constants";
import { useAuth } from "./AuthContext";

export type FavoriteMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

type Store = Record<string, FavoriteMovie[]>;

type FavoritesContextValue = {
  favorites: FavoriteMovie[];
  count: number;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: FavoriteMovie) => void;
  removeFavorite: (id: number) => void;
  shareText: () => string;
  shareUrl: () => string;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const store = useLocalStorage<Store>(STORAGE_KEYS.favorites, {});
  const key = user?.id ?? "";
  const favorites = useMemo(() => (key ? store.value[key] ?? [] : []), [store.value, key]);

  const write = useCallback(
    (list: FavoriteMovie[]) => store.setValue({ ...store.value, [key]: list }),
    [store, key],
  );

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (movie: FavoriteMovie) => {
      if (!user) {
        toast.error("Faça login para favoritar filmes.");
        return;
      }
      if (isFavorite(movie.id)) {
        write(favorites.filter((m) => m.id !== movie.id));
        toast("Removido dos favoritos");
      } else {
        write([movie, ...favorites]);
        toast.success("Adicionado aos favoritos ❤️");
      }
    },
    [user, favorites, isFavorite, write],
  );

  const removeFavorite = useCallback(
    (id: number) => {
      write(favorites.filter((m) => m.id !== id));
      toast("Removido dos favoritos");
    },
    [favorites, write],
  );

  const shareText = useCallback(
    () =>
      favorites.length
        ? `Meus filmes favoritos no CineFlix:\n${favorites
            .map((m, i) => `${i + 1}. ${m.title}`)
            .join("\n")}`
        : "Ainda não tenho filmes favoritos no CineFlix.",
    [favorites],
  );

  const shareUrl = useCallback(() => {
    const ids = favorites.map((m) => m.id).join(",");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/favoritos?ids=${ids}`;
  }, [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      count: favorites.length,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      shareText,
      shareUrl,
    }),
    [favorites, isFavorite, toggleFavorite, removeFavorite, shareText, shareUrl],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  return ctx;
}
