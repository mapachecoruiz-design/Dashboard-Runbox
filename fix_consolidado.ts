import fs from 'fs';

let content = fs.readFileSync('src/services/consolidadoService.ts', 'utf8');
content = content.replace(
  "export const calculateMonthlyConsolidado = (", 
  "export const calculateMonthlyConsolidado = (\n  tariffsList: BaseTariff[],"
);
content = content.replace(
  "const configs = generateProjectionsConfig(clients, ufValue);",
  "const configs = generateProjectionsConfig(tariffsList, clients, ufValue);"
);
fs.writeFileSync('src/services/consolidadoService.ts', content);

let projContent = fs.readFileSync('src/pages/Projections.tsx', 'utf8');
projContent = projContent.replace(
  "const { clients, ufValue, orders } = useAppContext();",
  "const { clients, ufValue, orders, tariffs } = useAppContext();"
);
projContent = projContent.replace(
  "const initialConfigs = generateProjectionsConfig(clients, ufValue);",
  "const initialConfigs = generateProjectionsConfig(tariffs, clients, ufValue);"
);
fs.writeFileSync('src/pages/Projections.tsx', projContent);
