const fs = require('fs');
const file = 'src/pages/ConsolidadoMensual/ComparativoGraficos.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\\\`\\\$\\\$\{(.*?)\}\\\`/g, '`$$${$1}`');
code = code.replace(/\\\`\\\$(\\\$)?\{(.*?)\}(.*?)\\\`/g, '`$$${$2}$3`');
code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync(file, code);
