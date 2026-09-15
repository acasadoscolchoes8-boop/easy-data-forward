import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DeliveryBadge } from "@/components/delivery-badge";
import { LINES } from "@/data/site";
import { getCatalog } from "@/lib/content.functions";
import { PRODUCT_DETAILS } from "@/data/product-details";
import { ProductLayers } from "@/components/product-layers";
import { useInstitutional } from "@/hooks/use-institutional";

export const Route = createFileRoute("/produto/$slug")({
  loader: async ({ params }) => {
    const catalog = await getCatalog();
    const product = catalog.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    const related = catalog.filter((p) => p.line === product.line && p.slug !== product.slug).slice(
      0,
      3,
    );
    return { product, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Produto indisponível — Mannes Colchões" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const pageUrl = `https://meusitemannes.lovable.app/produto/${product.slug}`;
    return {
      meta: [
        { title: `Colchão ${product.name} — Mannes Colchões` },
        { name: "description", content: product.descricao.slice(0, 155) },
        { property: "og:title", content: `Colchão ${product.name} — Mannes` },
        { property: "og:description", content: product.descricao.slice(0, 155) },
        { property: "og:image", content: product.image },
        { name: "twitter:image", content: product.image },
        { property: "og:type", content: "product" },
        { property: "og:url", content: pageUrl },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `Colchão ${product.name}`,
            description: product.descricao,
            image: product.image,
            brand: { "@type": "Brand", name: "Mannes Colchões" },
            url: pageUrl,
          }),
        },
      ],
    };
  },
  component: ProdutoPage,
});

function ProdutoPage() {
  const { product, related } = Route.useLoaderData();
  const CONTACT = useInstitutional();
  const line = LINES.find((l) => l.slug === product.line);
  const detail = PRODUCT_DETAILS[product.slug];

  const specs = [
    ["Altura", product.altura],
    ["Conforto", product.conforto],
    ["Mola", product.mola],
    ["Tecnologia", product.destaque],
    ["Suporte", product.suporte],
    ["Categoria", product.tecido],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Link
          to="/produtos"
          search={{}}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Voltar aos produtos
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl bg-cream p-8">
            <img
              src={product.image}
              alt={`Colchão ${product.name}`}
              className="w-full object-contain"
            />
          </div>

          <div>
            {line && (
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Linha {line.name}
              </p>
            )}
            <h1 className="mt-2 font-display text-4xl font-extrabold uppercase sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {product.descricao}
            </p>

            <div className="mt-5">
              <DeliveryBadge />
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {specs.map(([label, value]) => (
                <div key={label} className="bg-background p-4">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Olá! Tenho interesse no colchão ${product.name} da Mannes e gostaria de mais informações.`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Adquira o seu
              </a>
            </div>
          </div>
        </div>

        <ProductLayers
          productName={product.name}
          fallbackImage={product.image}
          detail={detail}
        />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="section-title text-2xl sm:text-3xl">Você também pode gostar</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/produto/$slug"
                  params={{ slug: item.slug }}
                  className="group rounded-3xl bg-cream p-5"
                >
                  <img
                    src={item.image}
                    alt={`Colchão ${item.name}`}
                    loading="lazy"
                    className="h-36 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <h3 className="mt-4 font-display text-lg font-extrabold uppercase">{item.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[item.altura, item.conforto].filter(Boolean).join(" • ")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
