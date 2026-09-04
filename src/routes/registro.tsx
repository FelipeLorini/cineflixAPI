import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Criar conta gratuita | CineFlix" },
      {
        name: "description",
        content:
          "Crie sua conta CineFlix em segundos para salvar favoritos e comentar nos filmes.",
      },
      { property: "og:title", content: "Criar conta gratuita | CineFlix" },
      {
        property: "og:description",
        content: "Cadastre-se no CineFlix e monte sua lista de filmes favoritos.",
      },
    ],
  }),
  component: () => (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">Criar conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          É rápido e gratuito. Seus dados ficam salvos neste navegador.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-7 shadow-card">
        <RegisterForm />
      </div>
    </div>
  ),
});
