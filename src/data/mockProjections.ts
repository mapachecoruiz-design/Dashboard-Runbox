export type TariffType = 'por_pedido' | 'fija' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador';
export type CalendarType = 'lunes_domingo' | 'lunes_sabado' | 'lunes_viernes';

export interface ClientProjectionConfig {
  id: string;
  name: string;
  diasTrabajados: number;
  diasMes: number;
  tipoTarifa: TariffType;
  precio: number; // Price per order or fixed price
  moneda: 'CLP' | 'UF';
  valorUf?: number;
  cargoFijo?: number;
  cargoVariable?: number;
  aplicaIva: boolean;
  observaciones?: string;
  subClients?: string[];
  calendarType?: CalendarType;
  countNormalHolidays?: boolean;
  countIrrenunciableHolidays?: boolean;
  manualAdjustment?: boolean;
}

export const initialProjectionsConfig: ClientProjectionConfig[] = [
  { id: '1', name: 'Booz', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'agrupador', precio: 0, moneda: 'CLP', aplicaIva: true, observaciones: 'Agrupador de Booz ruta normal, Colina, express, Concepción y Pedidos grandes', subClients: ['1a', '1b', '1c', '2', '3'], calendarType: 'lunes_domingo', countNormalHolidays: true, countIrrenunciableHolidays: false },
  { id: '1a', name: 'Booz ruta normal', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'fija', precio: 90000, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true, countIrrenunciableHolidays: false },
  { id: '1b', name: 'Booz ruta Colina', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'fija', precio: 100000, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true, countIrrenunciableHolidays: false },
  { id: '1c', name: 'Booz ruta express', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'fija', precio: 65000, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true, countIrrenunciableHolidays: false },
  { id: '2', name: 'Booz Concepción', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 4100, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_domingo', countNormalHolidays: true, countIrrenunciableHolidays: false },
  { id: '3', name: 'Pedidos grandes y otros Booz', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'fija', precio: 2000000, moneda: 'CLP', aplicaIva: true, observaciones: 'Cargo especial editable', calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '4', name: 'Bazar Revistas', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 2990, moneda: 'CLP', aplicaIva: true, observaciones: 'Si son más de 30 revistas por día es $3500', calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '6', name: 'Farmaloop 9 AM', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 3950, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '7', name: 'Farmaloop Express 12M', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 4850, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '8', name: 'Farmaloop Express 3PM', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 5850, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '9', name: 'Farmaloop Fertilidad', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 6500, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '10', name: 'Farmaloop Mutual', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 15000, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '11', name: 'Liga', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'agrupador', precio: 0, moneda: 'CLP', aplicaIva: true, observaciones: 'Agrupador de Liga STGO, Liche Concepcion, Recetarios', subClients: ['12', '13', '14', '15'], calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '12', name: 'Liga STGO', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', precio: 0, cargoFijo: 18, cargoVariable: 0.08, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '13', name: 'Liche Concepción', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', precio: 0, cargoFijo: 10, cargoVariable: 0.08, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '14', name: 'Recetarios Concepción', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.08, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '15', name: 'Recetarios Santiago', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.08, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '16', name: 'MarketCare', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.10, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '17', name: 'Sesfar', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.10, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_sabado', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '18', name: 'Rosaria', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.09, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '19', name: 'Mundo Gato', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.09, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '20', name: 'El Reinal', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'cargo_fijo_uf_mas_variable_uf', precio: 0, cargoFijo: 5, cargoVariable: 0.15, moneda: 'UF', valorUf: 37000, aplicaIva: true, observaciones: 'Fórmula especial: (5 UF + MAX(0, Pedidos proyectados - 30) * 0.15 UF)', calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '21', name: 'Yapp', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'agrupador', precio: 0, moneda: 'CLP', aplicaIva: true, observaciones: 'Agrupador Yapp', subClients: ['22', '23', '24', '25', '26', '27', '28', '29'], calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '22', name: 'Lo Barnechea', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 2950, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '23', name: 'Farplus', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.1035, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '24', name: 'La Reina', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.1035, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '25', name: 'Famafull', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.1035, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '26', name: 'Medicca', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.1035, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '27', name: 'Farmaz', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 3900, moneda: 'CLP', aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '28', name: 'Liche', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.1035, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '29', name: 'Valdivia', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.1035, moneda: 'UF', valorUf: 37000, aplicaIva: true, observaciones: 'Dejar editable porque puede no tener movimientos todos los meses', calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '30', name: 'Intent', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.09, moneda: 'UF', valorUf: 37000, aplicaIva: true, calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false },
  { id: '31', name: 'eDark Store', diasTrabajados: 0, diasMes: 22, tipoTarifa: 'por_pedido', precio: 0.08, moneda: 'UF', valorUf: 37000, aplicaIva: true, observaciones: '0.08 si es FLEX. 0.095 si es BODEGA. >5 bultos 0.011 extra', calendarType: 'lunes_viernes', countNormalHolidays: false, countIrrenunciableHolidays: false }
];

// Helper to get random accumulated orders for mock
export const getMockAccumulatedOrders = (id: string) => {
  // Use a predictable seed based on string so it doesn't change every render
  const sum = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return (sum * 13) % 400 + 10; 
};
