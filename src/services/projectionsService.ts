import { Order, Client, TariffRule } from '../types';
import { isBefore, startOfDay, isSameDay } from 'date-fns';
import { ClientProjectionConfig, TariffType, CalendarType } from '../data/mockProjections';
import { initialTariffs, BaseTariff } from '../data/tariffs';

export const getAccumulatedOrdersByClient = (
  orders: Order[],
  clientId: string,
  month: number, // 1-12
  year: number,
  cutoffDate: Date
): number => {
  const targetMonth = month - 1; 
  
  const filtered = orders.filter(o => {
    if (o.clientId !== clientId) return false;
    if (!o.deliveryDate) return false;
    
    // Ignore failed and returned if needed? The mock logic counted everything or was hardcoded.
    // Let's count them unless requested otherwise.
    
    const d = new Date(o.deliveryDate);
    // Be careful with timezone, use UTC if needed, but simple Date object works for local YYYY-MM-DD
    const [y, m, day] = o.deliveryDate.split('-');
    const localDate = new Date(Number(y), Number(m) - 1, Number(day));
    
    if (localDate.getMonth() !== targetMonth || localDate.getFullYear() !== year) return false;
    
    const dStart = startOfDay(localDate);
    const cutoffStart = startOfDay(cutoffDate);
    if (isBefore(cutoffStart, dStart)) return false; 
    
    return true;
  });
  
  return filtered.length;
};

export const generateProjectionsConfig = (
  clientsList: Client[],
  ufValue: number
): ClientProjectionConfig[] => {
  return clientsList.map(c => {
    const t = initialTariffs.find(t => t.clientId === c.id) || {
      tipoTarifa: 'fija', moneda: 'CLP', aplicaIva: false
    } as BaseTariff;
    
    let calendarType: CalendarType = 'lunes_viernes';
    if (t.calendarType) {
      calendarType = t.calendarType;
    } else {
       // defaults by name rules
       const name = c.name.toLowerCase();
       if (name.includes('booz')) calendarType = 'lunes_domingo';
       else if (name.includes('liga') || name.includes('farmaloop') || name.includes('marketcare') || name.includes('sesfar')) calendarType = 'lunes_sabado';
    }

    return {
      id: c.id,
      name: c.name,
      diasTrabajados: 0,
      diasMes: 22,
      tipoTarifa: t.tipoTarifa as TariffType,
      precio: t.precio || 0,
      moneda: t.moneda,
      valorUf: t.moneda === 'UF' ? ufValue : undefined,
      cargoFijo: t.cargoFijo,
      cargoVariable: t.cargoVariable,
      aplicaIva: t.aplicaIva,
      observaciones: t.observaciones || (c.isAgrupador ? 'Agrupador' : undefined),
      subClients: c.subClients as string[] | undefined,
      calendarType: calendarType,
      countNormalHolidays: name.includes('booz') ? true : false,
      countIrrenunciableHolidays: false,
      manualAdjustment: false
    };
  });
};
