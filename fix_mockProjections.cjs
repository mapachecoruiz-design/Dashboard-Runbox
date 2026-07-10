const fs = require('fs');

const mockProjectionsContent = `import { clients } from './clients';
import { initialTariffs, BaseTariff } from './tariffs';

export type TariffType = 'por_pedido' | 'fija' | 'cargo_fijo_mas_variable' | 'cargo_fijo_uf_mas_variable_uf' | 'agrupador' | 'formula_especial';
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

export const initialProjectionsConfig: ClientProjectionConfig[] = clients.map(c => {
  const t = initialTariffs.find(t => t.clientId === c.id) || {
    tipoTarifa: 'fija', moneda: 'CLP', aplicaIva: false
  } as BaseTariff;
  
  return {
    id: c.id,
    name: c.name,
    diasTrabajados: 0,
    diasMes: 22,
    tipoTarifa: t.tipoTarifa as TariffType,
    precio: t.precio || 0,
    moneda: t.moneda,
    valorUf: t.moneda === 'UF' ? 37000 : undefined,
    cargoFijo: t.cargoFijo,
    cargoVariable: t.cargoVariable,
    aplicaIva: t.aplicaIva,
    observaciones: t.observaciones || (c.isAgrupador ? 'Agrupador' : undefined),
    subClients: c.subClients as string[] | undefined,
    calendarType: t.calendarType,
    countNormalHolidays: t.countNormalHolidays,
    countIrrenunciableHolidays: t.countIrrenunciableHolidays
  };
});

// Helper to get random accumulated orders for mock
export const getMockAccumulatedOrders = (id: string) => {
  // Use a predictable seed based on string so it doesn't change every render
  const sum = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return (sum * 13) % 400 + 10; 
};
`;
fs.writeFileSync('src/data/mockProjections.ts', mockProjectionsContent);
