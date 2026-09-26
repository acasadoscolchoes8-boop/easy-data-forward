import { cp, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist-kinghost");
const requiredFiles = ["_shell.html", ".htaccess", "favicon.png", "robots.txt", "sitemap.xml"];
const copiedDirectories = ["assets"];

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

await Promise.all([
  ...requiredFiles.map((file) => assertReadable(resolve(root, file))),
  ...copiedDirectories.map((directory) => assertReadable(resolve(root, directory))),
]);

const shell = await readFile(resolve(root, "_shell.html"), "utf8");
const references = [...new Set(localReferences(shell))];
for (const reference of references) {
  await assertReadable(resolve(root, reference));
}

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
    const destination = resolve(output, file === "_shell.html" ? "index.html" : file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(resolve(root, file), destination);
  }),
  ...copiedDirectories.map((directory) =>
    cp(resolve(root, directory), resolve(output, directory), { recursive: true }),
  ),
]);

console.log(`Pacote Kinghost criado em ${relative(root, output)}/ com ${assetFiles.length} arquivos em assets.`);