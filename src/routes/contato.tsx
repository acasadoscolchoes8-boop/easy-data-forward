import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useInstitutional } from "@/hooks/use-institutional";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato Mannes Colchões — Fale conosco e onde encontrar" },
      {
        name: "description",
        content:
          "Fale com a Mannes Colchões: (11) 94085-1995, Alphashopping - Alameda Madeira, 53 - Loja 4, Alphaville Industrial, Barueri - SP.",
      },
      { property: "og:title", content: "Contato — Mannes Colchões" },
      {
        property: "og:description",
        content: "Para dúvidas ou mais informações, fale com a equipe Mannes Colchões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

  }),
  component: ContatoPage,
});

function ContatoPage() {
  const CONTACT = useInstitutional();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="bg-primary px-4 py-16 text-center text-primary-foreground sm:px-6">
          <h1 className="section-title text-4xl sm:text-5xl">Contato</h1>
          <p className="mt-3 text-sm opacity-85 sm:text-base">Fale conosco</p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="section-title text-2xl sm:text-3xl">
              Para dúvidas ou
              <br />
              mais informações
            </h2>
            <ul className="mt-8 space-y-5 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                <a href={CONTACT.phoneHref} className="font-semibold hover:underline">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Onde nos encontrar:</strong> {CONTACT.address}
                  <br />
                  {CONTACT.city}
                </span>
              </li>
            </ul>
            <div className="mt-8 flex gap-3">
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-border p-2.5 text-primary transition-colors hover:bg-secondary"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-full border border-border p-2.5 text-primary transition-colors hover:bg-secondary"
              >
                <Facebook className="size-5" />
              </a>
            </div>
            <iframe
              title="Mapa da localização da Mannes Colchões no Alphashopping"
              src="https://www.google.com/maps?q=Alphashopping,+Alameda+Madeira,+53,+Loja+4,+Alphaville+Industrial,+Barueri,+SP,+06454-010&output=embed"
              className="mt-8 h-64 w-full rounded-3xl border border-border"
              loading="lazy"
            />

          </div>

          <form
            className="rounded-3xl bg-cream p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const nome = String(data.get("nome") ?? "");
              const email = String(data.get("email") ?? "");
              const telefone = String(data.get("telefone") ?? "");
              const mensagem = String(data.get("mensagem") ?? "");
              const subject = encodeURIComponent(`Contato pelo site — ${nome}`);
              const body = encodeURIComponent(
                `Nome: ${nome}\nE-mail: ${email}\nTelefone: ${telefone}\n\nMensagem:\n${mensagem}`,
              );
              window.location.href = `mailto:acasadoscolchoes8@gmail.com?subject=${subject}&body=${body}`;
              setSent(true);
            }}
          >
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest">Seu nome *</span>
                <input
                  required
                  name="nome"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Seu e-mail *
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest">Telefone *</span>
                <input
                  required
                  name="telefone"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Sua mensagem *
                </span>
                <textarea
                  required
                  name="mensagem"
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-start gap-3 text-xs text-muted-foreground">
                <input required type="checkbox" className="mt-0.5 size-4 shrink-0" />
                <span>Li e concordo com a política de privacidade deste site.</span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Enviar
            </button>

            {sent && (
              <p className="mt-4 rounded-xl bg-lime/40 px-4 py-3 text-sm text-foreground">
                Seu aplicativo de e-mail foi aberto com a mensagem pronta — é só confirmar o envio.
                Se preferir, fale conosco pelo WhatsApp (11) 94085-1995.
              </p>
            )}
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
