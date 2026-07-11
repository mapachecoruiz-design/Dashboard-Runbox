import { ClientId } from './clients';

export type TariffType = 'fija' | 'por_pedido' | 'por_ruta' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';

export interface BaseTariff {
  clientId: string;
  tipoTarifa: TariffType;
  moneda: 'CLP' | 'UF';
  aplicaIva: boolean;
  precio?: number; // Base price or fixed price
  cargoFijo?: number; // For cargo_fijo_uf_mas_variable_uf
  cargoVariable?: number; // For cargo_fijo_uf_mas_variable_uf
  calendarType?: 'lunes_viernes' | 'lunes_sabado' | 'lunes_domingo';
  countNormalHolidays?: boolean;
  countIrrenunciableHolidays?: boolean;
  observaciones?: string;
  validFrom?: string;
  validTo?: string | null;
  history?: any[];
}

export const initialTariffs: BaseTariff[] = [

  // Booz
  { clientId: 'booz', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'booz_ruta_normal', tipoTarifa: 'por_ruta', moneda: 'CLP', precio: 90000, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_ruta_colina', tipoTarifa: 'por_ruta', moneda: 'CLP', precio: 100000, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_ruta_express', tipoTarifa: 'por_ruta', moneda: 'CLP', precio: 65000, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_concepcion', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4100, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },

  // Bazar Revistas
  { clientId: 'bazar_revistas', tipoTarifa: 'formula_especial', moneda: 'CLP', precio: 2990, aplicaIva: true, observaciones: 'Si promedio diario supera 30, usar $3500' },
  
  // Farmaloop
  { clientId: 'farmaloop_9am', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3950, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_express_12m', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4850, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_express_3pm', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 5850, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_fertilidad', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 6500, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_mutual', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 15000, aplicaIva: true, calendarType: 'lunes_sabado' },
  
  // Liga
  { clientId: 'liga', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'liga_stgo', tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', moneda: 'UF', cargoFijo: 18, cargoVariable: 0.08, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'liche_concepcion', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4200, aplicaIva: true },
  { clientId: 'recetarios_concepcion', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4200, aplicaIva: true },
  { clientId: 'recetarios_santiago', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3950, aplicaIva: true, calendarType: 'lunes_sabado' },

  { clientId: 'marketcare', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3200, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'sesfar', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3200, aplicaIva: true, calendarType: 'lunes_sabado' },
  
  // Rosaria, Mundo Gato, El Reinal
  { clientId: 'rosaria', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3100, aplicaIva: true },
  { clientId: 'mundo_gato', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3100, aplicaIva: true },
  { clientId: 'el_reinal', tipoTarifa: 'formula_especial', moneda: 'UF', cargoFijo: 5, cargoVariable: 0.15, aplicaIva: true },

  // Lo Barnechea, Farplus, La Reina
  { clientId: 'lo_barnechea', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4500, aplicaIva: false },
  { clientId: 'farplus', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3200, aplicaIva: true },
  { clientId: 'la_reina', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4500, aplicaIva: false },

  // Farmafull, Medicca, Farmaz, Liche
  { clientId: 'farmafull', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3200, aplicaIva: true },
  { clientId: 'medicca', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3300, aplicaIva: true },
  { clientId: 'farmaz', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3400, aplicaIva: true },
  { clientId: 'liche', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3200, aplicaIva: true },

  // Valdivia, Intent, Yapp
  { clientId: 'valdivia', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4500, aplicaIva: true },
  { clientId: 'intent', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3500, aplicaIva: true },
  { clientId: 'yapp', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  
  // eDark Store
  { clientId: 'edark_store', tipoTarifa: 'formula_especial', moneda: 'UF', precio: 0.08, aplicaIva: true }
];
