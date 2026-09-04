import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/utils/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            Cine<span className="text-primary">Flix</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Catálogo de filmes com dados em tempo real da API TMDB. Favorite, comente e
            compartilhe suas descobertas.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Categorias</p>
          <ul className="mt-3 space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link
                  to="/filmes"
                  search={{ categoria: c.key }}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Conta</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                to="/login"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Entrar
              </Link>
            </li>
            <li>
              <Link
                to="/registro"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Criar conta
              </Link>
            </li>
            <li>
              <Link
                to="/favoritos"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Meus favoritos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CineFlix • Dados fornecidos por TMDB
      </div>
    </footer>
  );
}
