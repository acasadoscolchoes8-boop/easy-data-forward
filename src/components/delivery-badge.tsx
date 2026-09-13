import { Truck, MapPin } from "lucide-react";

export function DeliveryBadge({ className }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-lime/60 bg-lime/10 px-3 py-1.5 text-xs font-semibold text-foreground ${className ?? ""}`}
    >
      <Truck className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span className="hidden sm:inline">Entregamos para todo o Brasil</span>
      <span className="sm:hidden">Entrega Brasil</span>
      <span className="h-3 w-px bg-lime/60" aria-hidden="true" />
      <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span className="text-lime-foreground">Frete Grátis SP</span>
    </div>
  );
}
