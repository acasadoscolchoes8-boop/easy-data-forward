import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DeliveryBanner } from "@/components/delivery-banner";
import { QuizPopup } from "@/components/quiz-popup";
import { LINES } from "@/data/site";
import { DEFAULT_HERO, getCatalog, getSiteContent } from "@/lib/content.functions";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Colchões Mannes em Alphaville | King Mattress" },
      {
        name: "description",
        content:
          "Loja de colchões Mannes em Alphaville, Barueri. Encontre colchões de molas e espuma com atendimento especializado na King Mattress.",
      },
      { property: "og:title", content: "Colchões Mannes em Alphaville | King Mattress" },
      {
        property: "og:description",
        content:
          "Representante autorizada Mannes em Alphaville, com atendimento especializado para você escolher o colchão ideal.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://meusitemannes.lovable.app/" },
      {
        property: "og:image",
        content:
          "https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Principal_mobile-1.jpg",
      },
      {
        name: "twitter:image",
        content:
          "https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Principal_mobile-1.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://meusitemannes.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "King Mattress Colchões",
          description:
            "Representante autorizada Mannes Colchões em Alphaville, especializada em colchões de molas e espuma.",
          url: "https://meusitemannes.lovable.app/",
          telephone: "+55 11 94085-1995",
          taxID: "60.952.390/0001-21",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Alameda Madeira, 53, Loja 4, Alphashopping",
            addressLocality: "Barueri",
            addressRegion: "SP",
            postalCode: "06454-010",
            addressCountry: "BR",
          },
          areaServed: ["Alphaville", "Barueri", "Grande São Paulo"],
          hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Alphashopping, Alameda Madeira, 53, Loja 4, Alphaville Industrial, Barueri, SP, 06454-010")}`,
          brand: { "@type": "Brand", name: "Mannes Colchões" },
        }),
      },
    ],
  }),
  loader: async () => ({
    content: await getSiteContent(),
    catalog: await getCatalog(),
  }),
  component: Index,
});

function Index() {
  const { content, catalog } = Route.useLoaderData();
  const { hero } = content;
  const desktopHero = hero.image.includes("_mobile") ? DEFAULT_HERO.image : hero.image;
  return (
    <div className="min-h-screen">
      <QuizPopup catalog={catalog} whatsapp={content.institutional.whatsapp} />
      <SiteHeader />


      <main>
        <section aria-label="Destaque Mannes">
          <a href={hero.ctaTo} className="block">
            <picture>
              <source media="(min-width: 750px)" srcSet={desktopHero} />
              <img src={hero.mobileImage} alt={hero.alt} className="block h-auto w-full" fetchPriority="high" />
            </picture>
          </a>
        </section>

        <DeliveryBanner />

        {/* Linhas */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <h1 className="section-title mx-auto max-w-3xl text-center text-3xl leading-tight sm:text-5xl">
            Colchões Mannes em Alphaville
            <br />
            qualidade acima da média
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
            Na King Mattress você encontra colchões de molas e espuma Mannes com atendimento
            especializado para escolher o conforto ideal.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {LINES.map((line) => (
              <article
                key={line.slug}
                className="group flex flex-col rounded-3xl bg-cream p-6 transition-shadow hover:shadow-lg"
              >
                <img
                  src={line.image}
                  alt={line.name}
                  loading="lazy"
                  className="h-48 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <h2 className="mt-6 font-display text-2xl font-bold uppercase">{line.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{line.tagline}</p>
                <Link
                  to="/produtos"
                  search={{ linha: line.slug }}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary"
                >
                  Conheça a linha <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Tecnologias */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <img
            src="https://mannes.com.br/wp-content/uploads/2025/04/Mannes_Banner-Site_tecnologias.jpg"
            alt="Detalhe das tecnologias aplicadas nos colchões Mannes"
            loading="lazy"
            className="h-72 w-full object-cover opacity-60 lg:h-[26rem]"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <h2 className="section-title max-w-lg text-3xl leading-tight sm:text-5xl">
                Maior qualidade de sono
              </h2>
              <p className="mt-4 max-w-xl text-sm sm:text-base">
                Todos os <strong>colchões Mannes</strong> passam por tratamentos antiácaros e
                antialérgicos, visando a proteção do usuário contra alergias e proporcionando uma
                saúde segura durante todo o período de descanso.
              </p>
              <Link
                to="/tecnologias"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold uppercase tracking-wide text-lime-foreground"
              >
                Conheça nossas tecnologias <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>


        {/* Onde encontrar */}
        <section className="bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <h2 className="section-title text-3xl sm:text-4xl">Beleza e elegância</h2>
              <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
                Na <strong>Mannes Colchões</strong> cada detalhe é pensado com a maior atenção para
                garantir o conforto e a segurança do consumidor.
              </p>
              <Link
                to="/contato"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
              >
                Adquira já o seu <ArrowRight className="size-4" />
              </Link>
            </div>
            <img
              src="https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Onde_Encontrar.png"
              alt="Quarto decorado com conjunto de colchão e cama box Mannes"
              loading="lazy"
              className="w-full rounded-3xl object-cover"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
