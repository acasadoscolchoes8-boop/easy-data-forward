import { Link, createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DeliveryBadge } from "@/components/delivery-badge";
import { CARD_SPECS, FILTERS, LINES, type Product } from "@/data/site";
import { getCatalog } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

type FilterKey = (typeof FILTERS)[number]["key"];

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): { linha?: string } =>
    typeof search["linha"] === "string" ? { linha: search["linha"] } : {},

  head: () => ({
    meta: [
      { title: "Produtos Mannes — Catálogo de colchões com filtros" },
      {
        name: "description",
        content:
          "Catálogo completo de colchões Mannes: filtre por categoria de tecido, suporte, tipo de mola, conforto e altura.",
      },
      { property: "og:title", content: "Produtos — Mannes Colchões" },
      {
        property: "og:description",
        content: "Qualidade acima da média: encontre o colchão ideal filtrando por conforto, mola e altura.",
      },
    ],
  }),
  loader: () => getCatalog(),
  component: ProdutosPage,
});

function matches(product: Product, selected: Record<string, string[]>) {
  return Object.entries(selected).every(([key, values]) => {
    if (values.length === 0) return true;
    const field = product[key as keyof Product];
    return typeof field === "string" && values.includes(field);
  });
}

function ProdutosPage() {
  const { linha } = Route.useSearch();
  const catalog = Route.useLoaderData();
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [openFilters, setOpenFilters] = useState(false);

  const activeLine = LINES.find((l) => l.slug === linha);

  const filtered = useMemo(() => {
    const base = activeLine ? catalog.filter((p) => p.line === activeLine.slug) : catalog;
    return base.filter((p) => matches(p, selected));
  }, [activeLine, selected, catalog]);

  const activeCount = Object.values(selected).reduce((n, v) => n + v.length, 0);

  function toggle(key: FilterKey, option: string) {
    setSelected((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="bg-primary px-4 py-16 text-center text-primary-foreground sm:px-6">
          <h1 className="section-title text-4xl sm:text-5xl">Produtos</h1>
          <p className="mt-3 text-sm opacity-85 sm:text-base">Qualidade acima da média</p>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {activeLine ? activeLine.name : `${filtered.length} produtos`}
            </p>
            <button
              type="button"
              onClick={() => setOpenFilters((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground lg:hidden"
            >
              {openFilters ? <X className="size-4" /> : <SlidersHorizontal className="size-4" />}
              {openFilters ? "Fechar filtro" : "Abrir filtro"}
              {activeCount > 0 && !openFilters && (
                <span className="rounded-full bg-lime px-2 text-lime-foreground">{activeCount}</span>
              )}
            </button>
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className={cn("lg:block", openFilters ? "block" : "hidden")}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold uppercase">Filtros</h2>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelected({})}
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-6">
                {FILTERS.map((group) => (
                  <fieldset key={group.key}>
                    <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {group.label}
                    </legend>
                    <div className="mt-3 space-y-2">
                      {group.options.map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-start gap-2 text-sm text-foreground/85"
                        >
                          <input
                            type="checkbox"
                            checked={(selected[group.key] ?? []).includes(option)}
                            onChange={() => toggle(group.key, option)}
                            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </aside>

            <section>
              {filtered.length === 0 ? (
                <p className="rounded-2xl bg-cream p-8 text-center text-sm text-muted-foreground">
                  Nenhum produto encontrado com esses filtros. Tente remover alguma opção.
                </p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((product) => (
                    <Link
                      key={product.slug}
                      to="/produto/$slug"
                      params={{ slug: product.slug }}
                      className="group flex flex-col rounded-3xl bg-cream p-5 transition-shadow hover:shadow-lg"
                    >
                      <img
                        src={product.image}
                        alt={`Colchão ${product.name}`}
                        loading="lazy"
                        className="h-40 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      <h3 className="mt-5 font-display text-lg font-extrabold uppercase">
                        {product.name}
                      </h3>
                      <div className="mt-3">
                        <DeliveryBadge />
                      </div>
                      <ul className="mt-3 flex-1 space-y-1 text-xs text-muted-foreground">
                        {(
                          CARD_SPECS[product.slug] ??
                          (Array.from(
                            new Set(
                              [product.altura, product.conforto, product.mola, product.destaque].filter(
                                Boolean,
                              ) as string[],
                            ),
                          ) as string[])
                        ).map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                      <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                        Mais detalhes &gt;
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
