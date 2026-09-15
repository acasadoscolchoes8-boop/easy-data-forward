import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useInstitutional } from "@/hooks/use-institutional";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Loja de Colchões em Alphaville | King Mattress" },
      {
        name: "description",
        content:
          "Visite a King Mattress, loja de colchões Mannes no Alphashopping em Alphaville, Barueri. Veja o mapa, trace sua rota ou ligue: (11) 94085-1995.",
      },
      { property: "og:title", content: "King Mattress no Alphashopping — Mapa e contato" },
      {
        property: "og:description",
        content: "Veja a localização da King Mattress em Alphaville, trace sua rota e fale com nossa equipe.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://meusitemannes.lovable.app/contato" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://meusitemannes.lovable.app/contato" }],
  }),
  component: ContatoPage,
});

const STORE_QUERY =
  "Alphashopping, Alameda Madeira, 53, Loja 4, Alphaville Industrial, Barueri, SP, 06454-010";
const STORE_MAP_URL = `https://www.google.com/maps?q=${encodeURIComponent(STORE_QUERY)}&output=embed`;

function StoreMap() {
  const [mapUrl, setMapUrl] = useState(STORE_MAP_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeActive, setRouteActive] = useState(false);

  const traceRoute = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Seu navegador não permite acessar a localização.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
        setMapUrl(
          `https://www.google.com/maps?saddr=${origin}&daddr=${encodeURIComponent(STORE_QUERY)}&output=embed`,
        );
        setRouteActive(true);
        setLoading(false);
      },
      () => {
        setError(
          "Não conseguimos acessar sua localização. Permita o acesso no navegador ou abra a rota no Google Maps.",
        );
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  return (
    <div className="mt-8">
      <iframe
        key={mapUrl}
        title={
          routeActive
            ? "Rota da sua localização até a Mannes Colchões no Alphashopping"
            : "Mapa da localização da Mannes Colchões no Alphashopping"
        }
        src={mapUrl}
        className="h-64 w-full rounded-3xl border border-border"
        loading="lazy"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={traceRoute}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <Navigation className="size-4" />
          {loading ? "Buscando sua localização..." : routeActive ? "Recalcular rota" : "Traçar rota até a loja"}
        </button>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE_QUERY)}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-primary underline"
        >
          Abrir rota no Google Maps
        </a>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ContatoPage() {
  const CONTACT = useInstitutional();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="bg-primary px-4 py-16 text-center text-primary-foreground sm:px-6">
          <h1 className="section-title text-4xl sm:text-5xl">Loja de colchões em Alphaville</h1>
          <p className="mt-3 text-sm opacity-85 sm:text-base">Visite a King Mattress no Alphashopping</p>
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
            <StoreMap />

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
