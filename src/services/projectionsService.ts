import { Order, Client } from '../types';
import { isBefore, startOfDay } from 'date-fns';
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
    
    // Ignore completely invalid statuses for accumulated (we want operational volume)
    if (['devuelto'].includes(o.status)) return false;

    // Use date order
    const dateString = o.deliveryDate || o.pickupDate || o.createdAt;
    if (!dateString) return false;
    
    const localDate = new Date(dateString);
    if (isNaN(localDate.getTime())) return false;
    
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
    const clientName = c.name.toLowerCase();
    const t = initialTariffs.find(t => t.clientId === c.id);

    let calendarType: CalendarType = 'lunes_viernes';

    if (t?.calendarType) {
      calendarType = t.calendarType;
    } else if (clientName.includes('booz')) {
      calendarType = 'lunes_domingo';
    } else if (
      clientName.includes('liga') ||
      clientName.includes('farmaloop') ||
      clientName.includes('marketcare') ||
      clientName.includes('sesfar')
    ) {
      calendarType = 'lunes_sabado';
    }

    const isBooz = clientName.includes('booz');

    return {
      id: c.id,
      name: c.name,
      diasTrabajados: 0,
      diasMes: 22,
      tipoTarifa: (t?.tipoTarifa || 'por_pedido') as TariffType,
      precio: t?.precio || 0,
      moneda: t?.moneda || 'CLP',
      valorUf: t?.moneda === 'UF' ? ufValue : undefined,
      cargoFijo: t?.cargoFijo,
      cargoVariable: t?.cargoVariable,
      aplicaIva: t?.aplicaIva ?? true,
      observaciones: t?.observaciones || (c.isAgrupador ? 'Agrupador' : undefined),
      subClients: c.subClients,
      calendarType,
      countNormalHolidays: isBooz,
      countIrrenunciableHolidays: false,
      manualAdjustment: false
    };
  });
};
