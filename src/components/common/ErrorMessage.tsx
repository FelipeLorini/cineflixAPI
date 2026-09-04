import { FaExclamationTriangle } from "react-icons/fa";

export function ErrorMessage({
  message = "Algo deu errado. Tente novamente.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
      <FaExclamationTriangle className="text-primary" size={28} />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="gradient-cta rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
