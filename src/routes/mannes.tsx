import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/mannes")({
  head: () => ({
    meta: [
      { title: "A Mannes — 60 anos de colchões feitos no Brasil" },
      {
        name: "description",
        content:
          "Conheça a Mannes Colchões: 60 anos de mercado, qualidade comprovada e certificação de homologação do Inmetro.",
      },
      { property: "og:title", content: "A Mannes — 60 anos no mercado" },
      {
        property: "og:description",
        content:
          "Uma marca que une inovação e bem-estar para você descansar melhor e sonhar mais alto.",
      },
      {
        property: "og:image",
        content: "https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Mannes.jpg",
      },
      {
        name: "twitter:image",
        content: "https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Mannes.jpg",
      },
    ],
  }),
  component: MannesPage,
});

function MannesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <img
          src="https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Mannes.jpg"
          alt="Banner comemorativo dos 60 anos da Mannes Colchões"
          className="h-64 w-full object-cover lg:h-96"
        />

        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="section-title text-4xl sm:text-5xl">Mannes</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Uma marca com 60 <strong className="text-foreground">anos no mercado</strong>
          </p>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A vida é feita de fases, descobertas e momentos inesquecíveis, e queremos estar presentes
            em cada um deles. A cada passo do seu caminho, levamos conforto e tecnologia para que
            você viva o melhor de cada dia.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Acreditamos que uma boa noite de sono é o primeiro passo para grandes realizações. Por
            isso, criamos colchões que combinam inovação e bem-estar, ajudando você a descansar
            melhor e sonhar mais alto.
          </p>
        </section>

        <section className="bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <img
              src="https://mannes.com.br/wp-content/uploads/2021/12/mannes-sobre.jpg"
              alt="Processo de fabricação dos colchões Mannes"
              loading="lazy"
              className="w-full rounded-3xl object-cover"
            />
            <div>
              <h2 className="section-title text-3xl sm:text-4xl">Qualidade comprovada</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Cada vez mais avançada, a tecnologia utilizada na fabricação dos colchões{" "}
                <strong className="text-foreground">Mannes</strong> prioriza, acima de tudo,
                proporcionar o máximo de conforto e acompanhar as tendências de tudo que é novo no
                mundo.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Seguindo esse ideal, a <strong className="text-foreground">Mannes</strong> compreende
                a importância de se reinventar e utilizar toda sua experiência para criar produtos
                jovens e inovadores.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-6 md:flex-row md:text-left">
          <img
            src="https://mannes.com.br/wp-content/uploads/2021/12/mannes-inmetro.png"
            alt="Selo de homologação do Inmetro"
            loading="lazy"
            className="h-28 w-auto shrink-0 object-contain"
          />
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Os <strong className="text-foreground">colchões Mannes</strong> possuem o certificado de
            homologação do Inmetro, que assegura a qualidade do produto para o bem-estar e a saúde do
            consumidor.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
