import { useState } from "react";
import { cn } from "@/lib/utils";
import { LAYER_GLOSSARY, type ProductDetail } from "@/data/product-details";

type Props = {
  productName: string;
  fallbackImage: string;
  detail: ProductDetail | undefined;
  resumo?: string;
};

export function ProductLayers({ productName, fallbackImage, detail, resumo }: Props) {
  const layers = detail?.layers ?? [];
  const icons = detail?.icons ?? [];
  const details = detail?.details ?? [];
  const [active, setActive] = useState(layers.length > 0 ? layers[0]!.n : 1);

  if (layers.length === 0 && icons.length === 0 && details.length === 0) return null;

  const activeLayer = layers.find((l) => l.n === active) ?? layers[0];
  const activeText = activeLayer ? LAYER_GLOSSARY[activeLayer.name.toLowerCase()] : undefined;
  const stack = layers.filter((l) => l.image);

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="section-title text-2xl sm:text-3xl">Composição em camadas</h2>

      {layers.length > 0 && (
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12">
          {/* Maquete: cada camada é a imagem original da referência, empilhada */}
          <div className="rounded-3xl bg-cream px-3 py-8 sm:px-6 sm:py-12">
            {stack.length > 0 ? (
              <div className="mx-auto flex w-full max-w-xl flex-col pl-9 sm:pl-14">
                {stack.map((layer, i) => (
                  <button
                    key={`stack-${layer.n}`}
                    type="button"
                    onClick={() => setActive(layer.n)}
                    aria-label={`Camada ${layer.n}: ${layer.name}`}
                    aria-pressed={active === layer.n}
                    className={cn(
                      "group relative block w-full cursor-pointer transition-all duration-300",
                      i > 0 && "-mt-[11%]",
                      active === layer.n
                        ? "-translate-y-1 opacity-100 sm:-translate-y-2"
                        : "opacity-80 hover:opacity-100",
                    )}
                    style={{ zIndex: active === layer.n ? 30 : stack.length - i }}
                  >
                    <img
                      src={layer.image}
                      alt={`${layer.name} — camada ${layer.n} do colchão ${productName}`}
                      loading="lazy"
                      className="w-full object-contain"
                    />
                    {/* chamada lateral: número fora do colchão, alinhado à camada */}
                    <span className="absolute left-0 top-1/2 flex -translate-x-full -translate-y-1/2 items-center">
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold shadow-sm transition-colors sm:size-8 sm:text-xs",
                          active === layer.n
                            ? "bg-lime text-primary ring-2 ring-primary"
                            : "bg-primary/85 text-primary-foreground group-hover:bg-primary",
                        )}
                      >
                        {layer.n}
                      </span>
                      <span
                        className={cn(
                          "h-px w-3 transition-colors sm:w-5",
                          active === layer.n ? "bg-primary" : "bg-primary/35",
                        )}
                      />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <img
                src={detail?.hero ?? fallbackImage}
                alt={`Colchão ${productName}`}
                loading="lazy"
                className="mx-auto w-full max-w-xl object-contain"
              />
            )}
          </div>

          <div>
            <ol className="space-y-2">
              {layers.map((layer) => (
                <li key={`${layer.n}-${layer.name}`}>
                  <button
                    type="button"
                    onClick={() => setActive(layer.n)}
                    aria-pressed={active === layer.n}
                    className={cn(
                      "flex w-full min-w-0 items-center gap-3 rounded-full px-3 py-2 text-left transition-colors",
                      active === layer.n
                        ? "bg-secondary ring-1 ring-primary/25"
                        : "hover:bg-secondary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold",
                        active === layer.n
                          ? "bg-lime text-primary ring-2 ring-primary"
                          : layer.highlight
                            ? "bg-lime/70 text-primary"
                            : "bg-primary text-primary-foreground",
                      )}
                    >
                      {String(layer.n).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 text-sm",
                        active === layer.n
                          ? "font-bold text-foreground"
                          : layer.highlight
                            ? "font-bold text-foreground"
                            : "text-foreground/85",
                      )}
                    >
                      {layer.name}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {activeLayer && (
              <div className="mt-6 rounded-3xl bg-cream p-5 sm:p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Camada {String(activeLayer.n).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-extrabold uppercase">
                  {activeLayer.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {activeText ??
                    `Camada ${activeLayer.n} da composição do colchão ${productName}, aplicada conforme a ficha técnica Mannes.`}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {details.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {details.map((src) => (
            <img
              key={src}
              src={src}
              alt={`Detalhe de acabamento do colchão ${productName}`}
              loading="lazy"
              className="w-full rounded-3xl bg-cream object-contain"
            />
          ))}
        </div>
      )}


      {icons.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Tecnologias e características
          </h3>
          <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {icons.map((icon) => (
              <li key={icon.name} className="flex flex-col items-center gap-3 text-center">
                <img
                  src={icon.image}
                  alt={icon.name}
                  loading="lazy"
                  className="size-16 object-contain sm:size-20"
                />
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                  {icon.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resumo && <p className="mt-10 text-sm leading-relaxed text-muted-foreground">{resumo}</p>}
    </section>
  );
}
