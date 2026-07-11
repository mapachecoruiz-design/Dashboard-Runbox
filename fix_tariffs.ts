import fs from 'fs';

let content = fs.readFileSync('src/data/tariffs.ts', 'utf8');

// Add validFrom, validTo, and history to BaseTariff
content = content.replace(
  "observaciones?: string;",
  "observaciones?: string;\n  validFrom?: string;\n  validTo?: string | null;\n  history?: any[];"
);

// Map initialTariffs to include validFrom: '2024-01-01'
content = content.replace(
  "export const initialTariffs: BaseTariff[] = [",
  "export const initialTariffs: BaseTariff[] = [\n"
);
fs.writeFileSync('src/data/tariffs.ts', content);
