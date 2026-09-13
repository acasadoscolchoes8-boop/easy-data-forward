import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TECHNOLOGY_ASSETS } from "@/assets/technologies";
import { COMFORT_LEVELS, SPRING_SYSTEMS, TECHNOLOGIES } from "@/data/site";

export const Route = createFileRoute("/tecnologias")({
  head: () => ({
    meta: [
      { title: "Tecnologias Mannes — Visco Gel, Gel Sense, Látex e mais" },
      {
        name: "description",
        content:
          "Visco Gel, Gel Sense, Hyper Cell, Reactive, Látex natural, Health Protection e borda Air Flow: as tecnologias dos colchões Mannes.",
      },
      { property: "og:title", content: "Tecnologias Mannes Colchões" },
      {
        property: "og:description",
        content:
          "Compreendemos a importância de se reinventar: conheça os níveis de conforto e as tecnologias dos colchões Mannes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TecnologiasPage,
});

function TecnologiasPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="relative flex min-h-56 items-center justify-center overflow-hidden px-4 py-16 text-center text-primary-foreground sm:min-h-72 sm:px-6">
          <img src={TECHNOLOGY_ASSETS.technologiesBanner} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-primary/70" />
          <div className="relative">
            <h1 className="section-title text-4xl sm:text-5xl">Tecnologias</h1>
            <p className="mt-3 text-sm opacity-85 sm:text-base">Compreendemos a importância de se reinventar</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl">Níveis de conforto:</h2>
          <div className="mt-10 space-y-8">
            {[COMFORT_LEVELS.slice(0, 2), COMFORT_LEVELS.slice(2)].map((row, rowIndex) => (
              <div key={rowIndex} className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 md:flex-row md:items-start md:gap-20">
                {row.map((level) => (
                  <figure key={level.label} className="flex min-w-40 flex-col items-center text-center">
                    <img src={level.image} alt={`Conforto ${level.label}`} width="155" height="130" className="icon-blue h-[130px] w-[155px] object-contain" />
                    <figcaption className="mt-3 text-sm font-bold uppercase">{level.label}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <h2 className="section-title text-2xl sm:text-3xl">Tecnologias</h2>
          <div className="mt-8 space-y-6">
            {TECHNOLOGIES.map((tech, i) => (
              <article
                key={tech.name}
                className={`grid items-center gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-2 ${
                  i % 2 === 0 ? "bg-cream" : "bg-secondary"
                }`}
              >
                <div className={`relative mx-auto flex min-h-56 w-full items-center justify-center overflow-hidden rounded-2xl ${i % 2 === 0 ? "" : "lg:order-2"}`}>
                  <img src={tech.image} alt={`Tecnologia ${tech.name}`} loading="lazy" className="max-h-72 w-full object-contain" />
                </div>
                <div>
                  {"icon" in tech && tech.icon ? <img src={tech.icon} alt="" loading="lazy" className="mb-4 h-20 w-auto object-contain" /> : null}
                  {"titleImage" in tech && tech.titleImage ? (
                    <img src={tech.titleImage} alt={tech.name} loading="lazy" className="h-16 max-w-full object-contain object-left" />
                  ) : (
                    <h3 className="font-display text-2xl font-extrabold uppercase">{tech.name}</h3>
                  )}
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {tech.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-secondary py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="section-title text-2xl sm:text-3xl">Sistema de molejos</h2>
            <div className="mt-10 space-y-10">
              {SPRING_SYSTEMS.map((spring) => (
                <article key={spring.name} className="grid items-center gap-6 border-b border-border pb-10 md:grid-cols-[180px_1fr] md:gap-10">
                  <img src={spring.icon} alt={`Ícone ${spring.name}`} loading="lazy" className="mx-auto max-h-44 w-40 object-contain" />
                  <div>
                    <h3 className="font-display text-xl font-extrabold uppercase sm:text-2xl">{spring.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{spring.text}</p>
                  </div>
                  {spring.image ? (
                    <img src={spring.image} alt="Sistema de molas ensacadas Mannes" loading="lazy" className="w-full rounded-2xl object-cover md:col-span-2" />
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
