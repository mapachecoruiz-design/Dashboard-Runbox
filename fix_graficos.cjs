const fs = require('fs');
const file = 'src/pages/ConsolidadoMensual/ComparativoGraficos.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\\\$\\\$\{(.*?)\}/g, '$$${$1}');
fs.writeFileSync(file, code);
