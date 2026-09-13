import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Mannes Colchões" },
      {
        name: "description",
        content: "Área de acesso restrito para administração do conteúdo do site Mannes Colchões.",
      },
      { property: "og:title", content: "Acesso administrativo — Mannes Colchões" },
      {
        property: "og:description",
        content: "Entrada restrita aos administradores do site Mannes Colchões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError("E-mail ou senha incorretos. Se é o primeiro acesso, use “Criar / recuperar senha”.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (resetError) {
      setError("Não foi possível enviar o e-mail agora. Tente novamente em alguns instantes.");
      return;
    }
    setInfo("Enviamos um link para o seu e-mail. Abra o link para definir a sua senha.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-background p-8 shadow-xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Voltar ao site
        </Link>

        <h1 className="section-title mt-6 text-2xl sm:text-3xl">Área administrativa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "login"
            ? "Entre com o e-mail e a senha de administrador."
            : "Informe o e-mail de administrador para receber o link de criação de senha."}
        </p>

        <form onSubmit={mode === "login" ? handleLogin : handleReset} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              E-mail
            </span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
              <Mail className="size-4 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="voce@exemplo.com"
              />
            </div>
          </label>

          {mode === "login" && (
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Senha
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border px-3 py-2.5">
                <Lock className="size-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>
          )}

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          {info && <p className="text-sm font-medium text-primary">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Aguarde…" : mode === "login" ? "Entrar" : "Enviar link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "reset" : "login");
            setError("");
            setInfo("");
          }}
          className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Criar / recuperar senha" : "Já tenho senha — voltar ao login"}
        </button>
      </div>
    </div>
  );
}
