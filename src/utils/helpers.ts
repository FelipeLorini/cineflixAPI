// Funções auxiliares de formatação e validação.

export const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
};

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const year = (value?: string | null) =>
  value ? value.slice(0, 4) : "----";

export const runtimeLabel = (minutes?: number | null) => {
  if (!minutes) return "—";
  return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
};

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export const isValidPassword = (password: string) => password.length >= 6;

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
