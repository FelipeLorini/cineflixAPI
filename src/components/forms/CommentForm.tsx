// Seção de comentários: criar, listar, editar e excluir (apenas o autor).
import { useState } from "react";
import { FaRegCommentDots, FaTrash, FaPen } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/context/CommentsContext";
import { formatDateTime } from "@/utils/helpers";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

const MAX = 500;

export function CommentForm({ movieId }: { movieId: number }) {
  const { user } = useAuth();
  const { getComments, addComment, updateComment, deleteComment } = useComments();
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);

  const comments = getComments(movieId);

  return (
    <section className="space-y-6">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <FaRegCommentDots className="text-primary" /> Comentários ({comments.length})
      </h2>

      <ProtectedRoute>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addComment(movieId, text);
            setText("");
          }}
          className="space-y-3 rounded-2xl border border-border bg-card p-5"
        >
          <textarea
            value={text}
            maxLength={MAX}
            rows={3}
            onChange={(e) => setText(e.target.value)}
            placeholder="O que você achou deste filme?"
            className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {text.length}/{MAX} caracteres
            </span>
            <button
              type="submit"
              className="gradient-cta rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Publicar
            </button>
          </div>
        </form>
      </ProtectedRoute>

      <ul className="space-y-4">
        {!comments.length && (
          <li className="text-sm text-muted-foreground">
            Nenhum comentário ainda. Seja o primeiro!
          </li>
        )}
        {comments.map((c) => (
          <li
            key={c.id}
            className="animate-fade-in rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{c.userName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(c.createdAt)}
                </p>
              </div>
              {c.userId === user?.id && (
                <div className="flex gap-2">
                  <button
                    aria-label="Editar comentário"
                    onClick={() => setEditing({ id: c.id, text: c.text })}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FaPen size={12} />
                  </button>
                  <button
                    aria-label="Excluir comentário"
                    onClick={() => deleteComment(c.id)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              )}
            </div>

            {editing?.id === c.id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={editing.text}
                  maxLength={MAX}
                  rows={3}
                  onChange={(e) => setEditing({ id: c.id, text: e.target.value })}
                  className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm outline-none focus:border-primary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateComment(c.id, editing.text);
                      setEditing(null);
                    }}
                    className="gradient-cta rounded-full px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                {c.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
