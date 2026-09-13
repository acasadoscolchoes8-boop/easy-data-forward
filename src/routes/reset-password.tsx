import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Definir nova senha — Mannes Colchões" },
      {
        name: "description",
        content: "Defina a senha de acesso à área administrativa do site Mannes Colchões.",
      },
      { property: "og:title", content: "Definir nova senha — Mannes Colchões" },
      {
        property: "og:description",
        content: "Página para criar ou atualizar a senha de administrador.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use uma senha com pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não são iguais.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError("O link expirou ou já foi usado. Peça um novo link na tela de acesso.");
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/admin", replace: true }), 1200);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-xl">
        <h1 className="section-title text-2xl sm:text-3xl">Definir senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha a senha que você usará para entrar na área administrativa.
        </p>

        {done ? (
          <p className="mt-6 text-sm font-medium text-primary">
            Senha definida com sucesso. Levando você ao painel…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {[
              { label: "Nova senha", value: password, set: setPassword },
              { label: "Repita a senha", value: confirm, set: setConfirm },
            ].map((field) => (
              <label key={field.label} className="block">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {field.label}
                </span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
                  <Lock className="size-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </label>
            ))}

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Salvando…" : "Salvar senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
