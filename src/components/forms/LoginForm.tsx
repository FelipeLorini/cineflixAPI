// Formulário de login com validação e "Lembrar-me".
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail, isValidPassword } from "@/utils/helpers";

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = "Informe um e-mail válido.";
    if (!isValidPassword(password)) next.password = "Mínimo de 6 caracteres.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      login(email, password, remember);
      toast.success("Bem-vindo de volta!");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field
        icon={<FaEnvelope size={12} />}
        label="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        placeholder="voce@email.com"
      />
      <Field
        icon={<FaLock size={12} />}
        label="Senha"
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        placeholder="••••••"
      />

      <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="h-4 w-4 accent-[oklch(0.634_0.196_17.5)]"
        />
        Lembrar-me
      </label>

      <button
        type="submit"
        className="gradient-cta w-full rounded-full py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
      >
        Entrar
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link to="/registro" className="font-semibold text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

export function Field({
  icon,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  placeholder?: string | undefined;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border bg-surface py-3 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary ${
            error ? "border-destructive" : "border-border"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
