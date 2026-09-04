// Protege conteúdos que exigem login (favoritos e comentários).
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FaLock } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) return <LoadingSpinner label="Verificando sua sessão..." />;

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <FaLock className="text-primary" size={26} />
        <h2 className="text-xl font-bold">Área exclusiva</h2>
        <p className="text-sm text-muted-foreground">
          Faça login para acessar seus filmes favoritos e comentários.
        </p>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="gradient-cta rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            Entrar
          </Link>
          <Link
            to="/registro"
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold"
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
