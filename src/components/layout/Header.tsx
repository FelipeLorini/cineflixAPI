// Cabeçalho com navegação, dropdown de categorias, busca e área do usuário.
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FaBars, FaHeart, FaChevronDown, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { CATEGORIES } from "@/utils/constants";
import { SearchBar } from "@/components/common/SearchBar";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useFavorites();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const linkClass =
    "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Cine<span className="text-primary">Flix</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-6 md:flex">
          <Link to="/" activeProps={{ className: "text-foreground" }} className={linkClass}>
            Início
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <Link
              to="/filmes"
              className={`${linkClass} inline-flex items-center gap-1`}
              activeProps={{ className: "text-foreground" }}
            >
              Filmes <FaChevronDown size={10} />
            </Link>
            {catOpen && (
              <div className="absolute left-0 top-full w-48 rounded-xl border border-border bg-popover p-2 shadow-card">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.key}
                    to="/filmes"
                    search={{ categoria: c.key }}
                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/favoritos"
            activeProps={{ className: "text-foreground" }}
            className={`${linkClass} inline-flex items-center gap-1`}
          >
            Favoritos
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar className="hidden w-56 lg:block" />

          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative rounded-full p-2 text-primary transition-colors hover:bg-secondary md:hidden"
          >
            <FaHeart size={16} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">
                Olá, <strong className="text-foreground">{user?.name}</strong>
              </span>
              <button
                onClick={() => setConfirmLogout(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                <FaSignOutAlt size={12} /> Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="gradient-cta rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Login
            </Link>
          )}

          <button
            aria-label="Abrir menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 md:hidden"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-fade-in space-y-3 border-t border-border px-4 py-4 md:hidden">
          <SearchBar />
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-1 text-sm">
            Início
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/filmes"
              search={{ categoria: c.key }}
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-sm text-muted-foreground"
            >
              {c.label}
            </Link>
          ))}
          <Link
            to="/favoritos"
            onClick={() => setMobileOpen(false)}
            className="block py-1 text-sm"
          >
            Favoritos ({count})
          </Link>
        </div>
      )}

      {confirmLogout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur">
          <div className="animate-rise w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
            <h2 className="text-lg font-bold">Sair da conta?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Seus favoritos e comentários continuarão salvos neste navegador.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 rounded-full border border-border py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  logout();
                  setConfirmLogout(false);
                  navigate({ to: "/" });
                }}
                className="gradient-cta flex-1 rounded-full py-2 text-sm font-semibold text-primary-foreground"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
