import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { CONTACT, PRODUCTS, type Product } from "@/data/site";

export type Hero = {
  image: string;
  mobileImage: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaTo: string;
};

export type Institutional = {
  phone: string;
  phoneHref: string;
  address: string;
  city: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  whatsappMessage: string;
  about: string;
};

export const DEFAULT_HERO: Hero = {
  image: "https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Principal.jpg",
  mobileImage: "https://mannes.com.br/wp-content/uploads/2025/04/2025_Mannes_Banner-Site_Principal_mobile-1.jpg",
  alt: "Mulher acordando bem descansada em uma cama com colchão Mannes",
  badge: "Entregamos para todo o Brasil",
  title: "",
  subtitle: "",
  ctaLabel: "Ver produtos",
  ctaTo: "/produtos",
};

export const DEFAULT_INSTITUTIONAL: Institutional = {
  ...CONTACT,
  about:
    "Na Mannes Colchões cada detalhe é pensado com a maior atenção para garantir o conforto e a segurança do consumidor.",
};

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type Row = Database["public"]["Tables"]["products"]["Row"];

export function rowToProduct(row: Row): Product {
  return {
    slug: row.slug,
    name: row.name,
    line: row.line,
    image: row.image,
    altura: row.altura,
    ...(row.conforto ? { conforto: row.conforto } : {}),
    ...(row.mola ? { mola: row.mola } : {}),
    ...(row.destaque ? { destaque: row.destaque } : {}),
    ...(row.suporte ? { suporte: row.suporte } : {}),
    ...(row.tecido ? { tecido: row.tecido } : {}),
    descricao: row.descricao,
  };
}

/** Catálogo público: usa o banco quando houver produtos, senão o catálogo base do site. */
export const getCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  try {
    const { data, error } = await publicClient()
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return PRODUCTS;
    return data.map(rowToProduct);
  } catch {
    return PRODUCTS;
  }
});

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ hero: Hero; institutional: Institutional }> => {
    try {
      const { data } = await publicClient().from("site_settings").select("key, value");
      const byKey = new Map((data ?? []).map((r) => [r.key, r.value as Record<string, unknown>]));
      return {
        hero: { ...DEFAULT_HERO, ...(byKey.get("hero") ?? {}) } as Hero,
        institutional: {
          ...DEFAULT_INSTITUTIONAL,
          ...(byKey.get("institutional") ?? {}),
        } as Institutional,
      };
    } catch {
      return { hero: DEFAULT_HERO, institutional: DEFAULT_INSTITUTIONAL };
    }
  },
);
