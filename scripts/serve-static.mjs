import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { createServer } from "node:http";

const projectRoot = process.cwd();
const root = resolve(projectRoot, process.env.STATIC_DIRECTORY ?? "dist");
const port = Number(process.env.PORT ?? 8080);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

createServer(async (request, response) => {
  const baseUrl = `http://${request.headers.host ?? "localhost"}`;
  const pathname = decodeURIComponent(new URL(request.url ?? "/", baseUrl).pathname);
  const requested = resolve(root, `.${pathname}`);
  const routeIndex = resolve(root, `.${pathname}`, "index.html");
  const safePath = requested.startsWith(root) && (await isFile(requested))
    ? requested
    : routeIndex.startsWith(root) && (await isFile(routeIndex))
      ? routeIndex
      : resolve(root, "index.html");

  response.setHeader("Content-Type", mimeTypes[extname(safePath)] ?? "application/octet-stream");
  if (safePath.endsWith("index.html")) response.setHeader("Cache-Control", "no-store");
  createReadStream(safePath).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Prévia estática disponível em http://localhost:${port}`);
});