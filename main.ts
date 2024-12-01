import { lib } from './lib';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Kommandozeilenargumente auswerten
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: npm run day <year-day>');
  process.exit(1);
}

const [year, day] = args[0].split('-');
const scriptPath = join(__dirname, `${year}`, `day${day}.ts`);

import(scriptPath)
  .then((module) => {
    if (module.run && module.runs) {
      lib.execute2(year, `day${day}.ts`, module.run, module.runs);
    } else {
      console.error(`No run function pr runs array found in ${scriptPath}`);
    }
  })
  .catch((err) => {
    console.error(`Error importing ${scriptPath}:`, err);
  });
