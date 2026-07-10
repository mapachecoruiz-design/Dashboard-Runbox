const fs = require('fs');
const file = 'src/data/tariffs.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export type TariffType = 'fija' | 'por_pedido' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';`,
  `export type TariffType = 'fija' | 'por_pedido' | 'por_ruta' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';`
);

code = code.replace(
  `{ clientId: 'booz_ruta_normal', tipoTarifa: 'fija'`,
  `{ clientId: 'booz_ruta_normal', tipoTarifa: 'por_ruta'`
);
code = code.replace(
  `{ clientId: 'booz_ruta_colina', tipoTarifa: 'fija'`,
  `{ clientId: 'booz_ruta_colina', tipoTarifa: 'por_ruta'`
);
code = code.replace(
  `{ clientId: 'booz_ruta_express', tipoTarifa: 'fija'`,
  `{ clientId: 'booz_ruta_express', tipoTarifa: 'por_ruta'`
);

fs.writeFileSync(file, code);

const mockProj = 'src/data/mockProjections.ts';
let codeMock = fs.readFileSync(mockProj, 'utf8');
codeMock = codeMock.replace(
  `export type TariffType = 'por_pedido' | 'fija' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';`,
  `export type TariffType = 'por_pedido' | 'por_ruta' | 'fija' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';`
);
fs.writeFileSync(mockProj, codeMock);
