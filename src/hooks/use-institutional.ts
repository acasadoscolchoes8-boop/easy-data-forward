import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT } from "@/data/site";

export type InstitutionalContent = {
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

export const INSTITUTIONAL_FALLBACK: InstitutionalContent = {
  ...CONTACT,
  about:
    "Uma marca com 60 anos no mercado, levando conforto e tecnologia para cada fase da sua vida.",
};

/** Lê as informações institucionais do banco com fallback para o conteúdo do site. */
export function useInstitutional(): InstitutionalContent {
  const [content, setContent] = useState<InstitutionalContent>(INSTITUTIONAL_FALLBACK);

  useEffect(() => {
    let active = true;
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "institutional")
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data?.value) return;
        setContent({ ...INSTITUTIONAL_FALLBACK, ...(data.value as Partial<InstitutionalContent>) });
      });
    return () => {
      active = false;
    };
  }, []);

  return content;
}
