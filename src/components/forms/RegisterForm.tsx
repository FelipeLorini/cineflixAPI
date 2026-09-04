// Formulário de registro com validação de campos.
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail, isValidPassword } from "@/utils/helpers";
import { Field } from "./LoginForm";

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  type Errors = {
    name?: string;
    email?: string;
    password?: string;
    confirm?: string;
  };
  const [errors, setErrors] = useState<Errors>({});

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Informe seu nome completo.";
    if (!isValidEmail(form.email)) next.email = "Informe um e-mail válido.";
    if (!isValidPassword(form.password)) next.password = "Mínimo de 6 caracteres.";
    if (form.password !== form.confirm) next.confirm = "As senhas não conferem.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      register(form.name, form.email, form.password);
      toast.success("Conta criada com sucesso!");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível cadastrar.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field
        icon={<FaUser size={12} />}
        label="Nome"
        type="text"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
        placeholder="Seu nome"
      />
      <Field
        icon={<FaEnvelope size={12} />}
        label="E-mail"
        type="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
        placeholder="voce@email.com"
      />
      <Field
        icon={<FaLock size={12} />}
        label="Senha"
        type="password"
        value={form.password}
        onChange={set("password")}
        error={errors.password}
        placeholder="Mínimo 6 caracteres"
      />
      <Field
        icon={<FaLock size={12} />}
        label="Confirmar senha"
        type="password"
        value={form.confirm}
        onChange={set("confirm")}
        error={errors.confirm}
        placeholder="Repita a senha"
      />

      <button
        type="submit"
        className="gradient-cta w-full rounded-full py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
      >
        Criar conta
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
