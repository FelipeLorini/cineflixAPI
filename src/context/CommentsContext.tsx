// Contexto de comentários (CRUD completo em localStorage).
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/constants";
import { uid } from "@/utils/helpers";
import { useAuth } from "./AuthContext";

export type Comment = {
  id: string;
  movieId: number;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

type CommentsContextValue = {
  getComments: (movieId: number) => Comment[];
  addComment: (movieId: number, text: string) => void;
  updateComment: (id: string, text: string) => void;
  deleteComment: (id: string) => void;
};

const CommentsContext = createContext<CommentsContextValue | null>(null);

export function CommentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const store = useLocalStorage<Comment[]>(STORAGE_KEYS.comments, []);

  const getComments = useCallback(
    (movieId: number) =>
      store.value
        .filter((c) => c.movieId === movieId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [store.value],
  );

  const addComment = useCallback(
    (movieId: number, text: string) => {
      if (!user) {
        toast.error("Faça login para comentar.");
        return;
      }
      const clean = text.trim().slice(0, 500);
      if (!clean) {
        toast.error("Escreva um comentário antes de enviar.");
        return;
      }
      store.setValue([
        {
          id: uid(),
          movieId,
          userId: user.id,
          userName: user.name,
          text: clean,
          createdAt: new Date().toISOString(),
        },
        ...store.value,
      ]);
      toast.success("Comentário publicado!");
    },
    [user, store],
  );

  const updateComment = useCallback(
    (id: string, text: string) => {
      store.setValue(
        store.value.map((c) =>
          c.id === id && c.userId === user?.id
            ? { ...c, text: text.trim().slice(0, 500) }
            : c,
        ),
      );
      toast.success("Comentário atualizado!");
    },
    [store, user],
  );

  const deleteComment = useCallback(
    (id: string) => {
      store.setValue(store.value.filter((c) => !(c.id === id && c.userId === user?.id)));
      toast("Comentário excluído");
    },
    [store, user],
  );

  const value = useMemo(
    () => ({ getComments, addComment, updateComment, deleteComment }),
    [getComments, addComment, updateComment, deleteComment],
  );

  return <CommentsContext.Provider value={value}>{children}</CommentsContext.Provider>;
}

export function useComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments deve ser usado dentro de CommentsProvider");
  return ctx;
}
