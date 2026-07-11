import { ClientId } from './clients';

export type TariffType = 'fija' | 'por_pedido' | 'por_ruta' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';

export interface BaseTariff {
  clientId: string;
  tipoTarifa: TariffType;
  moneda: 'CLP' | 'UF';
  aplicaIva: boolean;
  ivaIncluido?: boolean;
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
  { clientId: 'booz_pedidos_grandes', tipoTarifa: 'fija', moneda: 'CLP', precio: 2000000, aplicaIva: true, observaciones: 'Tarifa fija editable' },

  // Bazar Revistas
  { clientId: 'bazar_revistas', tipoTarifa: 'formula_especial', moneda: 'CLP', precio: 2990, aplicaIva: true, observaciones: 'Si promedio diario supera 30, usar $3500' },
  
  // Farmaloop
  { clientId: 'farmaloop_9am', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3950, aplicaIva: true, ivaIncluido: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_express_12m', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4850, aplicaIva: true, ivaIncluido: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_express_3pm', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 5850, aplicaIva: true, ivaIncluido: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_fertilidad', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 6500, aplicaIva: true, ivaIncluido: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_mutual', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 15000, aplicaIva: true, calendarType: 'lunes_sabado' },
  
  // Liga
  { clientId: 'liga', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'liga_stgo', tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', moneda: 'UF', cargoFijo: 18, cargoVariable: 0.08, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'liche_concepcion', tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', moneda: 'UF', cargoFijo: 10, cargoVariable: 0.08, aplicaIva: true },
  { clientId: 'recetarios_concepcion', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.08, aplicaIva: true },
  { clientId: 'recetarios_santiago', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.08, aplicaIva: true, calendarType: 'lunes_sabado' },

  { clientId: 'marketcare', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.10, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'sesfar', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.10, aplicaIva: true, calendarType: 'lunes_sabado' },
  
  // Rosaria, Mundo Gato, El Reinal
  { clientId: 'rosaria', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.09, aplicaIva: true },
  { clientId: 'mundo_gato', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.09, aplicaIva: true, ivaIncluido: true },
  { clientId: 'el_reinal', tipoTarifa: 'formula_especial', moneda: 'UF', cargoFijo: 5, cargoVariable: 0.15, aplicaIva: true },

  // Yapp & related
  { clientId: 'yapp', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'lo_barnechea', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 2950, aplicaIva: true },
  { clientId: 'farplus', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true },
  { clientId: 'la_reina', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true },
  { clientId: 'farmafull', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true },
  { clientId: 'medicca', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true },
  { clientId: 'farmaz', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3900, aplicaIva: true },
  { clientId: 'liche', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true },
  { clientId: 'valdivia', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true },
  
  { clientId: 'intent', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.09, aplicaIva: true },
  
  // eDark Store
  { clientId: 'edark_store', tipoTarifa: 'formula_especial', moneda: 'UF', precio: 0.08, aplicaIva: true, observaciones: 'Hasta 5 bultos. Adicional: 0.011 UF' }
];
