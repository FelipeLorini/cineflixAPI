// Barra de pesquisa com debounce de 500ms e sugestões instantâneas.
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import { movieService } from "@/services/movieService";
import { imageUrl } from "@/services/api";
import { year } from "@/utils/helpers";

export function SearchBar({ className = "" }: { className?: string }) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(term, 500);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["search-suggest", debounced],
    queryFn: () => movieService.search(debounced),
    enabled: debounced.trim().length > 1,
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    setOpen(false);
    navigate({ to: "/filmes", search: { q: term.trim() } });
  };

  const suggestions = (data?.results ?? []).slice(0, 6);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit} className="relative">
        <FaSearch
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={13}
        />
        <input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar filmes..."
          aria-label="Buscar filmes"
          className="w-full rounded-full border border-border bg-surface py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
      </form>

      {open && debounced.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-card">
          {isFetching && !suggestions.length && (
            <p className="p-3 text-xs text-muted-foreground">Buscando...</p>
          )}
          {!isFetching && !suggestions.length && (
            <p className="p-3 text-xs text-muted-foreground">
              Nenhum filme encontrado para "{debounced}".
            </p>
          )}
          {suggestions.map((m) => (
            <Link
              key={m.id}
              to="/filme/$id"
              params={{ id: String(m.id) }}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-secondary/50">
                {imageUrl(m.poster_path, "w200") && (
                  <img
                    src={imageUrl(m.poster_path, "w200")!}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  {year(m.release_date)} • ⭐ {m.vote_average.toFixed(1)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
