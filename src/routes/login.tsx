import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/forms/LoginForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar na sua conta | CineFlix" },
      {
        name: "description",
        content:
          "Acesse sua conta CineFlix para favoritar filmes, comentar e compartilhar sua lista.",
      },
      { property: "og:title", content: "Entrar na sua conta | CineFlix" },
      {
        property: "og:description",
        content: "Login do CineFlix — favoritos e comentários em um só lugar.",
      },
    ],
  }),
  component: () => (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">Bem-vindo de volta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre para acessar seus favoritos e comentários.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
        <LoginForm />
      </div>
    </div>
  ),
});
