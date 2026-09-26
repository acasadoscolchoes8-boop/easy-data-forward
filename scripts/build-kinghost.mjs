import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const root = process.cwd();
const outputDirectory = process.argv[2] ?? "dist-kinghost";
if (!/^[a-zA-Z0-9._-]+$/.test(outputDirectory)) {
  throw new Error("Nome de pasta de saída inválido.");
}
const output = resolve(root, outputDirectory);
const requiredFiles = [".htaccess", "favicon.png", "robots.txt", "sitemap.xml"];
const copiedDirectories = ["assets", "static-assets"];
const routes = ["/", "/produtos", "/escolha-ideal", "/tecnologias", "/mannes", "/contato"];
const snapshots = resolve(root, "static-pages");

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
  ...routes.map((route) =>
    assertReadable(resolve(snapshots, route === "/" ? "index.html" : `${route.slice(1)}/index.html`)),
  ),
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
  cp(resolve(root, "assets"), resolve(output, "assets"), { recursive: true }),
  cp(resolve(root, "static-assets"), output, { recursive: true }),
]);

for (const route of routes) {
  const relativeRoute = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
  const html = await readFile(resolve(snapshots, relativeRoute), "utf8");
  if (!html.includes("</html>")) {
    throw new Error(`Conteúdo HTML incompleto em ${route}.`);
  }
  const portableHtml = html
    .replace(/<script[^>]+src=["']\/~flock\.js["'][^>]*><\/script>/g, "")
    .replace(/<script[^>]*>[^<]*lovable-flock[^<]*<\/script>/g, "");

  const references = [...new Set(localReferences(portableHtml))];
  for (const reference of references) {
    if ((reference.startsWith("assets/") || reference.startsWith("__l5e/")) && !(await isReadable(resolve(output, reference)))) {
      throw new Error(`Arquivo usado por ${route} está ausente: ${reference}`);
    }
  }

  const destination = resolve(output, relativeRoute);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, portableHtml);
}

console.log(`Pacote estático criado em ${relative(root, output)}/ com ${routes.length} páginas e ${assetFiles.length} arquivos em assets.`);