import { Truck, MapPin } from "lucide-react";

export function DeliveryBanner() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2.5 text-center sm:px-6 sm:py-3">
        <span className="hidden sm:inline-flex">
          <Truck className="size-5 shrink-0" aria-hidden="true" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide sm:text-sm">
          Entregamos para todo o Brasil
          <span className="mx-2 inline-block h-4 w-px bg-primary-foreground/30 align-middle" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5 text-lime">
            <MapPin className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
            Frete Grátis para São Paulo e Grande São Paulo
          </span>
        </p>
      </div>
    </div>
  );
}
