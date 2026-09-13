import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DeliveryBadge } from "@/components/delivery-badge";
import { getCatalog, getSiteContent } from "@/lib/content.functions";
import {
  QUIZ_QUESTIONS,
  buildWhatsappMessage,
  recommendProducts,
  type QuizAnswers,
} from "@/lib/quiz";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/escolha-ideal")({
  head: () => ({
    meta: [
      { title: "Escolha o colchão ideal — teste rápido Mannes" },
      {
        name: "description",
        content:
          "Responda 7 perguntas rápidas e descubra qual colchão Mannes combina com seu peso, firmeza preferida, sustentação da coluna e altura ideal.",
      },
      { property: "og:title", content: "Escolha o colchão ideal — Mannes Colchões" },
      {
        property: "og:description",
        content:
          "Um teste guiado que indica os 3 colchões Mannes mais adequados para o seu sono e conecta você a um consultor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => ({
    catalog: await getCatalog(),
    content: await getSiteContent(),
  }),
  component: EscolhaIdealPage,
});

type Step = number | "contato" | "resultado";

function EscolhaIdealPage() {
  const { catalog, content } = Route.useLoaderData();
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const recommendations = useMemo(
    () => recommendProducts(catalog, answers),
    [catalog, answers],
  );

  const total = QUIZ_QUESTIONS.length;
  const currentIndex = typeof step === "number" ? step : total;
  const progress = Math.round(((currentIndex + (typeof step === "number" ? 0 : 1)) / (total + 1)) * 100);

  function pick(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setStep((s) => (typeof s === "number" ? (s + 1 < total ? s + 1 : "contato") : s));
  }

  function back() {
    setStep((s) => {
      if (s === "resultado") return "contato";
      if (s === "contato") return total - 1;
      return Math.max(0, s - 1);
    });
  }

  const whatsappLink = useMemo(() => {
    const msg = buildWhatsappMessage(name.trim(), phone.trim(), answers, recommendations);
    return `https://wa.me/${content.institutional.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [name, phone, answers, recommendations, content.institutional.whatsapp]);

  function submitContact(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (name.trim().length < 2) {
      setError("Por favor, informe seu nome completo.");
      return;
    }
    if (digits.length < 10) {
      setError("Informe um WhatsApp válido com DDD, por exemplo (11) 91234-5678.");
      return;
    }
    setError("");
    setStep("resultado");
    if (typeof window !== "undefined") {
      window.open(whatsappLink, "_blank", "noopener,noreferrer");
    }
  }

  function restart() {
    setAnswers({});
    setName("");
    setPhone("");
    setError("");
    setStep(0);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        <section className="bg-primary px-4 py-14 text-center text-primary-foreground sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-foreground">
            <Sparkles className="size-4" /> Consultor digital Mannes
          </p>
          <h1 className="section-title mt-5 text-3xl leading-tight sm:text-5xl">
            Escolha o colchão ideal
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-85 sm:text-base">
            Responda 7 perguntas rápidas sobre o seu sono e receba a indicação dos colchões que mais
            combinam com você.
          </p>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${step === "resultado" ? 100 : progress}%` }}
            />
          </div>

          {typeof step === "number" && QUIZ_QUESTIONS[step] && (
            <section className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Pergunta {step + 1} de {total}
              </p>
              <h2 className="section-title mt-3 text-2xl sm:text-3xl">
                {QUIZ_QUESTIONS[step]!.title}
              </h2>
              {QUIZ_QUESTIONS[step]!.subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {QUIZ_QUESTIONS[step]!.subtitle}
                </p>
              )}

              <div className="mt-6 grid gap-3">
                {QUIZ_QUESTIONS[step]!.options.map((option) => {
                  const selected = answers[QUIZ_QUESTIONS[step]!.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => pick(QUIZ_QUESTIONS[step]!.id, option.value)}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-2xl border-2 border-border bg-background px-5 py-4 text-left transition-colors hover:border-primary",
                        selected && "border-primary bg-cream",
                      )}
                    >
                      <span>
                        <span className="block font-semibold">{option.label}</span>
                        {option.hint && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {option.hint}
                          </span>
                        )}
                      </span>
                      <ArrowRight className="size-5 shrink-0 text-primary" />
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  <ArrowLeft className="size-4" /> Voltar
                </button>
              )}
            </section>
          )}

          {step === "contato" && (
            <section className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Último passo
              </p>
              <h2 className="section-title mt-3 text-2xl sm:text-3xl">
                Para quem enviamos a indicação?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Um consultor Mannes recebe suas respostas e entra em contato para tirar dúvidas,
                falar de tamanhos e condições.
              </p>

              <form onSubmit={submitContact} className="mt-6 space-y-4 rounded-3xl bg-cream p-6">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Seu nome
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome e sobrenome"
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    WhatsApp / Telefone
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 91234-5678"
                    inputMode="tel"
                    autoComplete="tel"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>

                {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground sm:w-auto"
                >
                  Ver meu resultado <ArrowRight className="size-4" />
                </button>
                <p className="text-xs text-muted-foreground">
                  Ao continuar, suas respostas e seu contato são enviados para o WhatsApp da Mannes
                  Colchões.
                </p>
              </form>

              <button
                type="button"
                onClick={back}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <ArrowLeft className="size-4" /> Voltar
              </button>
            </section>
          )}

          {step === "resultado" && (
            <section className="mt-8">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Resultado
              </p>
              <h2 className="section-title mt-3 text-2xl sm:text-3xl">
                {name.split(" ")[0]}, estes são os seus colchões
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Selecionamos as opções que mais combinam com as suas respostas. Um consultor vai
                falar com você pelo WhatsApp {phone}.
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-lime-foreground"
              >
                <MessageCircle className="size-4" /> Enviar para o consultor
              </a>

              <div className="mt-8 grid gap-6">
                {recommendations.map((rec, index) => (
                  <article
                    key={rec.product.slug}
                    className="grid gap-5 rounded-3xl bg-cream p-6 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]"
                  >
                    <img
                      src={rec.product.image}
                      alt={rec.product.name}
                      loading="lazy"
                      className="h-40 w-full object-contain"
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        {index === 0 ? "Melhor combinação" : `Opção ${index + 1}`}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold uppercase">
                        {rec.product.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{rec.product.descricao}</p>
                      <ul className="mt-4 space-y-1.5">
                        {rec.reasons.map((reason) => (
                          <li key={reason} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <DeliveryBadge />
                      </div>
                      <Link
                        to="/produto/$slug"
                        params={{ slug: rec.product.slug }}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary"
                      >
                        Ver detalhes <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                onClick={restart}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <RefreshCw className="size-4" /> Refazer o teste
              </button>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
