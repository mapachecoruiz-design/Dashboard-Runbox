const fs = require('fs');
const file = 'src/services/consolidadoService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export const generateConsolidadoRows`,
  `export const calculateMonthlyConsolidado`
);

fs.writeFileSync(file, code);

const file2 = 'src/pages/ConsolidadoMensual/mockData.ts';
let code2 = fs.readFileSync(file2, 'utf8');

code2 = code2.replace(
  `generateConsolidadoRows`,
  `calculateMonthlyConsolidado`
);
code2 = code2.replace(
  `generateConsolidadoRows`,
  `calculateMonthlyConsolidado`
);
fs.writeFileSync(file2, code2);
