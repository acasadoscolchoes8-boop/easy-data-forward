import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, LogOut, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LINES } from "@/data/site";
import {
  claimAdminAccess,
  deleteProduct,
  getAdminOverview,
  importBaseCatalog,
  reorderProducts,
  saveProduct,
  saveSetting,
  type ProductInput,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Mannes Colchões" },
      {
        name: "description",
        content: "Painel para gerenciar banner, catálogo de produtos e informações institucionais.",
      },
      { property: "og:title", content: "Painel administrativo — Mannes Colchões" },
      {
        property: "og:description",
        content: "Gestão de conteúdo do site Mannes Colchões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "banner", label: "Banner principal" },
  { id: "produtos", label: "Produtos" },
  { id: "institucional", label: "Institucional e contato" },
] as const;

const EMPTY_PRODUCT: ProductInput = {
  slug: "",
  name: "",
  line: LINES[0]?.slug ?? "colchoes",
  image: "",
  altura: "",
  conforto: "",
  mola: "",
  destaque: "",
  suporte: "",
  tecido: "",
  descricao: "",
  sort_order: 0,
  active: true,
};

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      )}
    </label>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const claim = useServerFn(claimAdminAccess);
  const overviewFn = useServerFn(getAdminOverview);
  const saveSettingFn = useServerFn(saveSetting);
  const saveProductFn = useServerFn(saveProduct);
  const deleteProductFn = useServerFn(deleteProduct);
  const reorderFn = useServerFn(reorderProducts);
  const importFn = useServerFn(importBaseCatalog);

  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("banner");
  const [status, setStatus] = useState("");

  const query = useQuery({
    queryKey: ["admin-overview"],
    retry: false,
    queryFn: async () => {
      await claim({ data: undefined as never }).catch(() => null);
      return overviewFn({ data: undefined as never });
    },
  });

  const [hero, setHero] = useState<Record<string, string>>({});
  const [inst, setInst] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<ProductInput | null>(null);

  useEffect(() => {
    if (!query.data) return;
    setHero(query.data.hero as unknown as Record<string, string>);
    setInst(query.data.institutional as unknown as Record<string, string>);
  }, [query.data]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-overview"] });

  const mutation = useMutation({
    mutationFn: async (action: () => Promise<unknown>) => action(),
    onSuccess: async () => {
      setStatus("Alterações salvas.");
      await refresh();
      setTimeout(() => setStatus(""), 3000);
    },
    onError: (e: Error) => setStatus(e.message || "Não foi possível salvar."),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (query.isLoading) {
    return <p className="p-10 text-sm text-muted-foreground">Carregando painel…</p>;
  }

  if (query.isError) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="section-title text-2xl">Acesso restrito</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Esta conta não tem permissão de administrador. Entre com a conta autorizada.
        </p>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
        >
          Sair
        </button>
      </div>
    );
  }

  const products = query.data?.products ?? [];

  function move(index: number, dir: -1 | 1) {
    const next = [...products];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    const b = next[target]!;
    mutation.mutate(() =>
      reorderFn({
        data: {
          order: [
            { id: a.id!, sort_order: b.sort_order },
            { id: b.id!, sort_order: a.sort_order },
          ],
        },
      }),
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-primary px-4 py-5 text-primary-foreground sm:px-8">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70">Mannes Colchões</p>
          <h1 className="font-display text-xl font-extrabold uppercase">Painel de conteúdo</h1>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-lime-foreground"
        >
          <LogOut className="size-4" /> Sair
        </button>
      </header>

      <nav className="flex gap-2 overflow-x-auto bg-background px-4 py-3 sm:px-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide ${
              tab === t.id ? "bg-primary text-primary-foreground" : "bg-cream text-foreground/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {status && (
          <p className="mb-6 rounded-xl bg-background px-4 py-3 text-sm font-medium text-primary">
            {status}
          </p>
        )}

        {tab === "banner" && (
          <section className="space-y-4 rounded-3xl bg-background p-6">
            <h2 className="section-title text-xl">Banner principal</h2>
            <Field label="Imagem (URL)" value={hero["image"] ?? ""} onChange={(v) => setHero({ ...hero, image: v })} />
            <Field label="Imagem para celular (URL)" value={hero["mobileImage"] ?? ""} onChange={(v) => setHero({ ...hero, mobileImage: v })} />
            {hero["image"] && (
              <img
                src={hero["image"]}
                alt="Pré-visualização do banner"
                className="max-h-48 w-full rounded-2xl object-cover"
              />
            )}
            <Field label="Texto alternativo da imagem" value={hero["alt"] ?? ""} onChange={(v) => setHero({ ...hero, alt: v })} />
            <Field label="Faixa de destaque" value={hero["badge"] ?? ""} onChange={(v) => setHero({ ...hero, badge: v })} />
            <Field label="Título" value={hero["title"] ?? ""} onChange={(v) => setHero({ ...hero, title: v })} />
            <Field label="Subtítulo" value={hero["subtitle"] ?? ""} onChange={(v) => setHero({ ...hero, subtitle: v })} />
            <Field label="Texto do botão" value={hero["ctaLabel"] ?? ""} onChange={(v) => setHero({ ...hero, ctaLabel: v })} />
            <Field label="Destino do botão" value={hero["ctaTo"] ?? ""} onChange={(v) => setHero({ ...hero, ctaTo: v })} />
            <button
              type="button"
              onClick={() => mutation.mutate(() => saveSettingFn({ data: { key: "hero", value: hero } }))}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Salvar banner
            </button>
          </section>
        )}

        {tab === "institucional" && (
          <section className="space-y-4 rounded-3xl bg-background p-6">
            <h2 className="section-title text-xl">Institucional e contato</h2>
            <Field label="Sobre a empresa" value={inst["about"] ?? ""} onChange={(v) => setInst({ ...inst, about: v })} textarea />
            <Field label="Telefone" value={inst["phone"] ?? ""} onChange={(v) => setInst({ ...inst, phone: v })} />
            <Field label="Telefone (link)" value={inst["phoneHref"] ?? ""} onChange={(v) => setInst({ ...inst, phoneHref: v })} />
            <Field label="Endereço" value={inst["address"] ?? ""} onChange={(v) => setInst({ ...inst, address: v })} />
            <Field label="Cidade" value={inst["city"] ?? ""} onChange={(v) => setInst({ ...inst, city: v })} />
            <Field label="Instagram" value={inst["instagram"] ?? ""} onChange={(v) => setInst({ ...inst, instagram: v })} />
            <Field label="Facebook" value={inst["facebook"] ?? ""} onChange={(v) => setInst({ ...inst, facebook: v })} />
            <Field label="WhatsApp (com DDD)" value={inst["whatsapp"] ?? ""} onChange={(v) => setInst({ ...inst, whatsapp: v })} />
            <Field label="Mensagem inicial do WhatsApp" value={inst["whatsappMessage"] ?? ""} onChange={(v) => setInst({ ...inst, whatsappMessage: v })} textarea />
            <button
              type="button"
              onClick={() => mutation.mutate(() => saveSettingFn({ data: { key: "institutional", value: inst } }))}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Salvar informações
            </button>
          </section>
        )}

        {tab === "produtos" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="section-title text-xl">Catálogo ({products.length})</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => mutation.mutate(() => importFn({ data: undefined as never }))}
                  className="rounded-full bg-background px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary"
                >
                  Importar catálogo do site
                </button>
                <button
                  type="button"
                  onClick={() => setEditing({ ...EMPTY_PRODUCT, sort_order: products.length * 10 })}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
                >
                  <Plus className="size-4" /> Novo produto
                </button>
              </div>
            </div>

            {editing && (
              <div className="space-y-4 rounded-3xl bg-background p-6">
                <h3 className="font-display text-lg font-bold uppercase">
                  {editing.id ? "Editar produto" : "Novo produto"}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nome" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
                  <Field label="Identificador (slug)" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Linha
                    </span>
                    <select
                      value={editing.line}
                      onChange={(e) => setEditing({ ...editing, line: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    >
                      {LINES.map((l) => (
                        <option key={l.slug} value={l.slug}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field label="Imagem (URL)" value={editing.image} onChange={(v) => setEditing({ ...editing, image: v })} />
                  <Field label="Altura" value={editing.altura} onChange={(v) => setEditing({ ...editing, altura: v })} />
                  <Field label="Conforto" value={editing.conforto} onChange={(v) => setEditing({ ...editing, conforto: v })} />
                  <Field label="Mola" value={editing.mola} onChange={(v) => setEditing({ ...editing, mola: v })} />
                  <Field label="Tecnologia em destaque" value={editing.destaque} onChange={(v) => setEditing({ ...editing, destaque: v })} />
                  <Field label="Suporte" value={editing.suporte} onChange={(v) => setEditing({ ...editing, suporte: v })} />
                  <Field label="Categoria / tecido" value={editing.tecido} onChange={(v) => setEditing({ ...editing, tecido: v })} />
                </div>
                {editing.image && (
                  <img src={editing.image} alt={editing.name} className="max-h-40 object-contain" />
                )}
                <Field label="Descrição" value={editing.descricao} onChange={(v) => setEditing({ ...editing, descricao: v })} textarea />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="size-4"
                  />
                  Visível no site
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      mutation.mutate(async () => {
                        await saveProductFn({ data: editing });
                        setEditing(null);
                      })
                    }
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground"
                  >
                    Salvar produto
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-full bg-cream px-6 py-3 text-sm font-semibold uppercase tracking-wide"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {products.length === 0 ? (
              <p className="rounded-3xl bg-background p-6 text-sm text-muted-foreground">
                Nenhum produto no banco ainda. O site mostra o catálogo original; use “Importar
                catálogo do site” para poder editá-lo aqui.
              </p>
            ) : (
              <ul className="space-y-3">
                {products.map((product, index) => (
                  <li
                    key={product.id ?? product.slug}
                    className="flex flex-wrap items-center gap-4 rounded-2xl bg-background p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-16 shrink-0 object-contain"
                      loading="lazy"
                    />
                    <div className="min-w-40 flex-1">
                      <p className="font-display text-sm font-bold uppercase">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.altura}
                        {product.active ? "" : " • oculto no site"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Mover para cima"
                        onClick={() => move(index, -1)}
                        className="rounded-full bg-cream p-2"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Mover para baixo"
                        onClick={() => move(index, 1)}
                        className="rounded-full bg-cream p-2"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing({ ...EMPTY_PRODUCT, ...product })}
                        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase text-primary-foreground"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir produto"
                        onClick={() => {
                          if (confirm(`Excluir ${product.name}?`)) {
                            mutation.mutate(() => deleteProductFn({ data: { id: product.id! } }));
                          }
                        }}
                        className="rounded-full bg-destructive p-2 text-destructive-foreground"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
