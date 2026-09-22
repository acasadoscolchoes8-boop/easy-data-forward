// Configuração EXCLUSIVA para gerar a versão estática do site para a Kinghost.
// NÃO use este arquivo no lugar de vite.config.ts — a versão publicada na
// Lovable depende da configuração original (com servidor para o envio de e-mail
// do quiz). Para gerar os arquivos da Kinghost rode: bun run build:kinghost
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Hospedagem tradicional (Apache) não roda servidor Node: gera só arquivos estáticos.
  nitro: false,
  tanstackStart: {
    spa: { enabled: true },
    prerender: { enabled: true },
  },
});
