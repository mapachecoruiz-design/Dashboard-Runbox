const fs = require('fs');
const file = 'src/pages/ConsolidadoMensual/TablaConsolidado.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `const totals = data.reduce((acc, row) => ({`,
  `// Calculate totals only using non-agrupador rows to avoid double counting
  const totals = data.filter(row => !row.isAgrupador).reduce((acc, row) => ({`
);

fs.writeFileSync(file, code);
