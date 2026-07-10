import { ClientId } from './clients';

export type TariffType = 'fija' | 'por_pedido' | 'por_ruta' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';

export interface BaseTariff {
  clientId: ClientId;
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
}

export const initialTariffs: BaseTariff[] = [
  // Booz
  { clientId: 'booz', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'booz_ruta_normal', tipoTarifa: 'por_ruta', moneda: 'CLP', precio: 90000, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_ruta_colina', tipoTarifa: 'por_ruta', moneda: 'CLP', precio: 100000, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_ruta_express', tipoTarifa: 'por_ruta', moneda: 'CLP', precio: 65000, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_concepcion', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4100, aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true },
  { clientId: 'booz_pedidos_grandes', tipoTarifa: 'fija', moneda: 'CLP', precio: 2000000, aplicaIva: true, observaciones: 'Cargo especial editable' },
  
  // Bazar Revistas
  { clientId: 'bazar_revistas', tipoTarifa: 'formula_especial', moneda: 'CLP', precio: 2990, aplicaIva: true, observaciones: 'Si promedio diario supera 30 es $3500, si no $2990' },
  
  // Farmaloop
  { clientId: 'farmaloop_9am', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3950, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_express_12m', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 4850, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_express_3pm', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 5850, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_fertilidad', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 6500, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'farmaloop_mutual', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 15000, aplicaIva: true, calendarType: 'lunes_sabado' },
  
  // Liga
  { clientId: 'liga', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'liga_stgo', tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', moneda: 'UF', cargoFijo: 18, cargoVariable: 0.08, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'liche_concepcion', tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', moneda: 'UF', cargoFijo: 10, cargoVariable: 0.08, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'recetarios_concepcion', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.08, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'recetarios_santiago', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.08, aplicaIva: true, calendarType: 'lunes_viernes' },
  
  // Otros
  { clientId: 'marketcare', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.10, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'sesfar', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.10, aplicaIva: true, calendarType: 'lunes_sabado' },
  { clientId: 'rosaria', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.09, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'mundo_gato', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.09, aplicaIva: true, calendarType: 'lunes_viernes' },
  
  // El Reinal
  { clientId: 'el_reinal', tipoTarifa: 'formula_especial', moneda: 'UF', cargoFijo: 5, cargoVariable: 0.15, aplicaIva: true, observaciones: '(5 UF + MAX(0, pedidos - 30) * 0.15 UF)', calendarType: 'lunes_viernes' },
  
  // Yapp
  { clientId: 'yapp', tipoTarifa: 'agrupador', moneda: 'CLP', aplicaIva: true },
  { clientId: 'lo_barnechea', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 2950, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'farplus', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'la_reina', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'farmafull', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'medicca', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'farmaz', tipoTarifa: 'por_pedido', moneda: 'CLP', precio: 3900, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'liche', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'valdivia', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.1035, aplicaIva: true, calendarType: 'lunes_viernes' },
  
  { clientId: 'intent', tipoTarifa: 'por_pedido', moneda: 'UF', precio: 0.09, aplicaIva: true, calendarType: 'lunes_viernes' },
  { clientId: 'edark_store', tipoTarifa: 'formula_especial', moneda: 'UF', precio: 0.08, aplicaIva: true, observaciones: 'Flex: 0.08, Bodega: 0.095. Hasta 5 bultos. Adicional 0.011 UF' },
];
