import fs from 'fs';

// Replace static initialTariffs with passed tariffs in projectionsService
let content = fs.readFileSync('src/services/projectionsService.ts', 'utf8');
content = content.replace(
  "export const generateProjectionsConfig = (", 
  "export const generateProjectionsConfig = (\n  tariffsList: BaseTariff[],"
);
content = content.replace(
  "const t = initialTariffs.find(t => t.clientId === c.id);",
  "const t = tariffsList.find(t => t.clientId === c.id);"
);
fs.writeFileSync('src/services/projectionsService.ts', content);
