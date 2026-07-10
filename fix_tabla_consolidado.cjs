const fs = require('fs');
const file = 'src/pages/ConsolidadoMensual/TablaConsolidado.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/text-2xl font-bold text-slate-900/g, 'text-2xl font-bold text-slate-900 truncate');
code = code.replace(/text-2xl font-bold text-indigo-700/g, 'text-2xl font-bold text-indigo-700 truncate');
code = code.replace(/text-2xl font-bold text-rose-700/g, 'text-2xl font-bold text-rose-700 truncate');
code = code.replace(/text-2xl font-bold text-emerald-700/g, 'text-2xl font-bold text-emerald-700 truncate');

fs.writeFileSync(file, code);
