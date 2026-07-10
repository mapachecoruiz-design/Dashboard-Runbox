const fs = require('fs');
const file = 'src/services/tariffEngine.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `case 'por_pedido':`,
  `case 'por_pedido':\n    case 'por_ruta':`
);

fs.writeFileSync(file, code);
