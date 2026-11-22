import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');

await mkdir(outputDirectory, { recursive: true });
await cp(resolve(repositoryRoot, 'game'), resolve(outputDirectory, 'game'), {
  recursive: true,
  force: true,
});
await cp(resolve(repositoryRoot, 'screenshots'), resolve(outputDirectory, 'screenshots'), {
  recursive: true,
  force: true,
});

const dossier = await buildDossier(outputDirectory, { text_max_bytes: 163840 });
await writeFile(resolve(outputDirectory, 'dossier.json'), dossier);
