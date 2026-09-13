import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/data/site";
import { sendQuizLead } from "@/lib/leads.functions";
import {
  QUIZ_QUESTIONS,
  answersSummary,
  buildWhatsappMessage,
  recommendProducts,
  type QuizAnswers,
} from "@/lib/quiz";
import { cn } from "@/lib/utils";

const SESSION_KEY = "mannes-quiz-popup";

type Step = "contato" | number | "resultado";

export function QuizPopup({ catalog, whatsapp }: { catalog: Product[]; whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("contato");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage indisponível: mostra o pop-up normalmente
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const recommendations = useMemo(() => recommendProducts(catalog, answers), [catalog, answers]);

  const total = QUIZ_QUESTIONS.length;
  const stepNumber = step === "contato" ? 0 : step === "resultado" ? total + 1 : step + 1;
  const progress = Math.round((stepNumber / (total + 1)) * 100);

  const whatsappLink = useMemo(() => {
    const msg = buildWhatsappMessage(name.trim(), phone.trim(), answers, recommendations);
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [name, phone, answers, recommendations, whatsapp]);

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
    setStep(0);
  }

  function next() {
    if (typeof step !== "number") return;
    const question = QUIZ_QUESTIONS[step]!;
    if (!answers[question.id]) {
      setError("Escolha uma opção para continuar.");
      return;
    }
    setError("");
    setStep(step + 1 < total ? step + 1 : "resultado");
  }

  function back() {
    setError("");
    setStep((s) => {
      if (s === "resultado") return total - 1;
      if (s === "contato") return "contato";
      return s - 1 < 0 ? "contato" : s - 1;
    });
  }

  function finish() {
    if (typeof window !== "undefined") {
      window.open(whatsappLink, "_blank", "noopener,noreferrer");
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Descubra o colchão ideal"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/60 p-4 py-8 backdrop-blur-sm sm:items-center"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-background shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full bg-cream text-foreground transition-colors hover:bg-border"
        >
          <X className="size-4" />
        </button>

        <div className="rounded-t-3xl bg-primary px-6 pb-6 pt-8 text-primary-foreground">
          <p className="inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-lime-foreground">
            <Sparkles className="size-3.5" /> Consultor digital Mannes
          </p>
          <h2 className="section-title mt-4 text-2xl leading-tight sm:text-3xl">
            Descubra o colchão ideal para você
          </h2>
          <p className="mt-2 text-sm opacity-85">
            Responda algumas perguntas rápidas e receba 3 indicações personalizadas.
          </p>
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-primary-foreground/25">
            <div
              className="h-full rounded-full bg-lime transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-6 py-6">
          {step === "contato" && (
            <form onSubmit={submitContact} className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Passo 1 de {total + 1}
              </p>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Seu nome
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome e sobrenome"
                  autoComplete="name"
                  maxLength={100}
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
                  maxLength={20}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
              >
                Próximo <ArrowRight className="size-4" />
              </button>
              <p className="text-xs text-muted-foreground">
                Seus dados e respostas são enviados para o WhatsApp da Mannes Colchões no final.
              </p>
            </form>
          )}

          {typeof step === "number" && QUIZ_QUESTIONS[step] && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Passo {step + 2} de {total + 1}
              </p>
              <h3 className="section-title mt-2 text-xl sm:text-2xl">
                {QUIZ_QUESTIONS[step]!.title}
              </h3>
              {QUIZ_QUESTIONS[step]!.subtitle && (
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {QUIZ_QUESTIONS[step]!.subtitle}
                </p>
              )}

              <div className="mt-5 grid gap-2.5">
                {QUIZ_QUESTIONS[step]!.options.map((option) => {
                  const selected = answers[QUIZ_QUESTIONS[step]!.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setError("");
                        setAnswers((prev) => ({ ...prev, [QUIZ_QUESTIONS[step]!.id]: option.value }));
                      }}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary",
                        selected && "border-primary bg-cream",
                      )}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{option.label}</span>
                        {option.hint && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {option.hint}
                          </span>
                        )}
                      </span>
                      {selected && <Check className="size-5 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>

              {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  <ArrowLeft className="size-4" /> Voltar
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
                >
                  {step + 1 === total ? "Ver resultado" : "Próximo"} <ArrowRight className="size-4" />
                </button>
              </div>
            </section>
          )}

          {step === "resultado" && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Resultado
              </p>
              <h3 className="section-title mt-2 text-xl sm:text-2xl">
                {name.split(" ")[0]}, estes são os seus 3 colchões
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Escolhemos as opções que mais combinam com as suas respostas.
              </p>

              <div className="mt-5 grid gap-4">
                {recommendations.map((rec, index) => (
                  <article key={rec.product.slug} className="rounded-2xl bg-cream p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={rec.product.image}
                        alt={rec.product.name}
                        loading="lazy"
                        className="size-20 shrink-0 object-contain"
                      />
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-primary">
                          {index === 0 ? "Melhor combinação" : `Opção ${index + 1}`}
                        </p>
                        <h4 className="font-display text-lg font-bold uppercase leading-tight">
                          {rec.product.name}
                        </h4>
                        <Link
                          to="/produto/$slug"
                          params={{ slug: rec.product.slug }}
                          onClick={() => setOpen(false)}
                          className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
                        >
                          Ver detalhes <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                    {rec.reasons.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {rec.reasons.slice(0, 2).map((reason) => (
                          <li key={reason} className="flex items-start gap-2 text-xs">
                            <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>

              <button
                type="button"
                onClick={finish}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-lime-foreground"
              >
                <MessageCircle className="size-4" /> Enviar para o consultor no WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Continuar navegando no site
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
