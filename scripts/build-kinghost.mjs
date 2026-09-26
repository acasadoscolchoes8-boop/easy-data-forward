import { cp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist-kinghost");
const siteOrigin = process.env.KINGHOST_SOURCE_URL ?? "https://meusitemannes.lovable.app";
const requiredFiles = [".htaccess", "favicon.png", "robots.txt", "sitemap.xml"];
const copiedDirectories = ["assets"];
const routes = ["/", "/produtos", "/escolha-ideal", "/tecnologias", "/mannes", "/contato"];

async function assertReadable(path) {
  try {
    await stat(path);
  } catch {
    throw new Error(`Arquivo obrigatório ausente: ${relative(root, path)}`);
  }
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else files.push(path);
  }
  return files;
}

function localReferences(html) {
  const matches = html.matchAll(/(?:src|href)=["']\/([^"'#?]+)["']/g);
  return [...matches].map((match) => match[1]).filter(Boolean);
}

async function downloadAsset(reference) {
  const destination = resolve(output, reference);
  if (await isReadable(destination)) return;

  const response = await fetch(new URL(reference, siteOrigin), {
    headers: { "User-Agent": "King-Mattress-static-export/1.0" },
  });
  if (!response.ok) throw new Error(`Falha ao baixar ${reference}: HTTP ${response.status}`);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function isReadable(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

await Promise.all([
  ...requiredFiles.map((file) => assertReadable(resolve(root, file))),
  ...copiedDirectories.map((directory) => assertReadable(resolve(root, directory))),
]);

const assetFiles = await listFiles(resolve(root, "assets"));
if (!assetFiles.some((file) => extname(file) === ".js")) {
  throw new Error("Nenhum arquivo JavaScript foi encontrado em assets.");
}
if (!assetFiles.some((file) => extname(file) === ".css")) {
  throw new Error("Nenhum arquivo CSS foi encontrado em assets.");
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  ...requiredFiles.map(async (file) => {
    const destination = resolve(output, file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(resolve(root, file), destination);
  }),
  ...copiedDirectories.map((directory) =>
    cp(resolve(root, directory), resolve(output, directory), { recursive: true }),
  ),
]);

for (const route of routes) {
  const response = await fetch(new URL(route, siteOrigin), {
    headers: { "User-Agent": "King-Mattress-static-export/1.0" },
  });
  if (!response.ok) {
    throw new Error(`Falha ao gerar ${route}: HTTP ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes("</html>")) {
    throw new Error(`Conteúdo HTML incompleto em ${route}.`);
  }

  const references = [...new Set(localReferences(html))];
  for (const reference of references) {
    if (reference.startsWith("assets/")) await downloadAsset(reference);
  }

  const relativeRoute = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
  const destination = resolve(output, relativeRoute);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

console.log(`Pacote Kinghost criado em ${relative(root, output)}/ com ${routes.length} páginas e ${assetFiles.length} arquivos em assets.`);