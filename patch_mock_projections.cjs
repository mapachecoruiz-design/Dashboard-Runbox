const fs = require('fs');
const file = 'src/data/mockProjections.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `export type TariffType = 'por_pedido' | 'fija' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador';`,
  `export type TariffType = 'por_pedido' | 'fija' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador';
export type CalendarType = 'lunes_domingo' | 'lunes_sabado' | 'lunes_viernes';`
);

code = code.replace(
  `  observaciones?: string;\n  subClients?: string[];\n}`,
  `  observaciones?: string;\n  subClients?: string[];\n  calendarType?: CalendarType;\n  countNormalHolidays?: boolean;\n  countIrrenunciableHolidays?: boolean;\n  manualAdjustment?: boolean;\n}`
);

// We need to map over the configs and add the new fields
// Let's just modify the JS string via regex/replace for the initial data, or rewrite the array entirely

fs.writeFileSync(file, code);
