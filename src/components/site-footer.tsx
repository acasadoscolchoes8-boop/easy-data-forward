import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { NAV } from "@/data/site";
import { useInstitutional } from "@/hooks/use-institutional";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export function SiteFooter() {
  const CONTACT = useInstitutional();
  return (
    <>
      <footer className="mt-24 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <span className="inline-block rounded-md border-2 border-primary-foreground px-3 py-1.5 leading-none">
            <span className="block font-display text-2xl font-extrabold tracking-tight">
              mannes
            </span>
            <span className="block text-[0.5rem] font-semibold uppercase tracking-[0.35em] opacity-80">
              colchões
            </span>
          </span>
          <p className="mt-5 max-w-xs text-sm opacity-80">{CONTACT.about}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime">Navegue</h3>
          <ul className="mt-4 space-y-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm opacity-85 transition-opacity hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm opacity-85">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={CONTACT.phoneHref} className="hover:underline">
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {CONTACT.address}
                <br />
                {CONTACT.city}
              </span>
            </li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-primary-foreground/40 p-2 transition-colors hover:bg-primary-foreground/10"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-primary-foreground/40 p-2 transition-colors hover:bg-primary-foreground/10"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>
        </div>
        <div className="border-t border-primary-foreground/15 py-5 text-center text-xs opacity-70">
          © {new Date().getFullYear()} Mannes Colchões. Todos os direitos reservados.
        </div>
      </footer>
      <WhatsAppFloat />
    </>
  );
}
