import { useInstitutional } from "@/hooks/use-institutional";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 fill-current">
      <path d="M16.01 3A12.77 12.77 0 0 0 5.2 22.55L3.5 28.75l6.35-1.66A12.77 12.77 0 1 0 16.01 3Zm0 23.37c-2.08 0-4.1-.61-5.82-1.76l-.42-.28-3.77.99 1.01-3.67-.3-.44A10.6 10.6 0 1 1 16 26.37Zm5.82-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57a9.52 9.52 0 0 1-1.76-2.19c-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.26-.74.26-1.38.18-1.51-.08-.14-.29-.21-.61-.37Z" />
    </svg>
  );
}

export function WhatsAppFloat() {
  const { whatsapp, whatsappMessage } = useInstitutional();
  const number = whatsapp.replace(/\D/g, "");
  if (!number) return null;

  const href = `https://wa.me/${number}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar com a Mannes pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-whatsapp transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:bottom-7 sm:right-7 sm:size-16"
    >
      <WhatsAppIcon />
    </a>
  );
}