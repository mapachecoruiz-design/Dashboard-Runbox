const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('ConsolidadoMensual')) {
  code = code.replace(
    `import { Integrations } from './pages/Integrations';`,
    `import { Integrations } from './pages/Integrations';\nimport { ConsolidadoMensual } from './pages/ConsolidadoMensual/ConsolidadoMensual';`
  );

  code = code.replace(
    `<Route path="projections" element={<Projections />} />`,
    `<Route path="projections" element={<Projections />} />\n            <Route path="consolidado" element={<ConsolidadoMensual />} />`
  );

  fs.writeFileSync(file, code);
}
