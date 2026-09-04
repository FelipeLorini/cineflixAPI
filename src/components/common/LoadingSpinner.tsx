import { FaFilm } from "react-icons/fa";

export function LoadingSpinner({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <FaFilm className="animate-spin text-primary" size={28} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Skeleton usado enquanto os pôsteres carregam. */
export function MovieSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-[2/3] w-full rounded-xl bg-card" />
          <div className="h-3 w-3/4 rounded bg-card" />
          <div className="h-3 w-1/2 rounded bg-card" />
        </div>
      ))}
    </div>
  );
}
