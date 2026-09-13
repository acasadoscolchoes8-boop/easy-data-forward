import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PRODUCTS } from "@/data/site";
import {
  DEFAULT_HERO,
  DEFAULT_INSTITUTIONAL,
  rowToProduct,
  type Hero,
  type Institutional,
} from "./content.functions";

export type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  line: string;
  image: string;
  altura: string;
  conforto: string;
  mola: string;
  destaque: string;
  suporte: string;
  tecido: string;
  descricao: string;
  sort_order: number;
  active: boolean;
};

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Acesso restrito a administradores.");
}

/** Concede o papel de administrador quando o e-mail está na lista autorizada. */
export const claimAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: already } = await context.supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (already) return { isAdmin: true };

    const email = String((context.claims as { email?: string }).email ?? "").toLowerCase();
    if (!email) return { isAdmin: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: allowed } = await supabaseAdmin
      .from("admin_allowlist")
      .select("email")
      .ilike("email", email)
      .maybeSingle();
    if (!allowed) return { isAdmin: false };

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: context.userId, role: "admin" }, { onConflict: "user_id,role" });
    return { isAdmin: true };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const [{ data: products }, { data: settings }] = await Promise.all([
      context.supabase.from("products").select("*").order("sort_order", { ascending: true }),
      context.supabase.from("site_settings").select("key, value"),
    ]);
    const byKey = new Map(
      (settings ?? []).map((r: { key: string; value: unknown }) => [
        r.key,
        r.value as Record<string, unknown>,
      ]),
    );
    return {
      products: (products ?? []) as ProductInput[],
      hero: { ...DEFAULT_HERO, ...(byKey.get("hero") ?? {}) } as Hero,
      institutional: {
        ...DEFAULT_INSTITUTIONAL,
        ...(byKey.get("institutional") ?? {}),
      } as Institutional,
    };
  });

export const saveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: "hero" | "institutional"; value: Record<string, unknown> }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("site_settings")
      .upsert({ key: data.key, value: data.value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: ProductInput) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const row = {
      slug: data.slug.trim(),
      name: data.name.trim(),
      line: data.line,
      image: data.image.trim(),
      altura: data.altura.trim(),
      conforto: data.conforto.trim() || null,
      mola: data.mola.trim() || null,
      destaque: data.destaque.trim() || null,
      suporte: data.suporte.trim() || null,
      tecido: data.tecido.trim() || null,
      descricao: data.descricao.trim(),
      sort_order: data.sort_order,
      active: data.active,
    };
    if (!row.slug || !row.name) throw new Error("Nome e identificador são obrigatórios.");
    const query = data.id
      ? context.supabase.from("products").update(row).eq("id", data.id)
      : context.supabase.from("products").insert(row);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { order: { id: string; sort_order: number }[] }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    for (const item of data.order) {
      const { error } = await context.supabase
        .from("products")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/** Copia o catálogo base do site para o banco (usado no primeiro acesso). */
export const importBaseCatalog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const rows = PRODUCTS.map((p, i) => ({
      slug: p.slug,
      name: p.name,
      line: p.line,
      image: p.image,
      altura: p.altura,
      conforto: p.conforto ?? null,
      mola: p.mola ?? null,
      destaque: p.destaque ?? null,
      suporte: p.suporte ?? null,
      tecido: p.tecido ?? null,
      descricao: p.descricao,
      sort_order: i * 10,
      active: true,
    }));
    const { error } = await context.supabase
      .from("products")
      .upsert(rows, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    const { data } = await context.supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    return { imported: (data ?? []).map(rowToProduct).length };
  });
