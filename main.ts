import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const destination = join(outputDir, 'entry.png');

await mkdir(outputDir, { recursive: true });
await copyFile(source, destination);
const [sourceStat, destinationStat, sourceBytes, destinationBytes] = await Promise.all([
  stat(source), stat(destination), readFile(source), readFile(destination),
]);
if (sourceStat.size !== sourceBytes.length ||
    destinationStat.size !== destinationBytes.length ||
    sourceStat.size !== destinationStat.size ||
    !sourceBytes.equals(destinationBytes)) {
  throw new Error('Copied entry.png does not match the source');
}
console.log(`Copied entry.png (${sourceStat.size} bytes); verified byte-identical.`);
