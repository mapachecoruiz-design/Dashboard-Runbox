import { ClientId } from '../data/clients';
import { initialTariffs, BaseTariff } from '../data/tariffs';
import { calculateClientRevenue } from './tariffEngine';
import { ConsolidadoMensualRow, CostoGeneral } from '../pages/ConsolidadoMensual/types';
import { Order, Client } from '../types';
import { getAccumulatedOrdersByClient, generateProjectionsConfig } from './projectionsService';
import { calculateWorkingDays } from '../utils/calendar';

export interface ClientMonthlyData {
  clientId: string;
  pedidos: number;
  costoPromedioP: number; 
}

export const distributeCosts = (
  rows: ConsolidadoMensualRow[], 
  costos: CostoGeneral[]
): ConsolidadoMensualRow[] => {
  // First calculate base totals
  let totalPedidos = 0;
  let totalIngresos = 0;
  
  rows.forEach(r => {
    if (!r.isAgrupador) {
       totalPedidos += r.pedidosMes;
       totalIngresos += r.ingresoSinIva;
    }
  });

  // Keep a map of added costs per client
  const addedCosts: Record<string, number> = {};
  rows.forEach(r => addedCosts[r.clientId] = 0);

  costos.forEach(costo => {
    if (costo.metodoDistribucion === 'no_distribuir') return;

    if (costo.metodoDistribucion === 'proporcional_pedidos' && totalPedidos > 0) {
       rows.forEach(r => {
         if (!r.isAgrupador) {
           const share = r.pedidosMes / totalPedidos;
           addedCosts[r.clientId] += costo.monto * share;
         }
       });
    } else if (costo.metodoDistribucion === 'proporcional_ingresos' && totalIngresos > 0) {
       rows.forEach(r => {
         if (!r.isAgrupador) {
           const share = r.ingresoSinIva / totalIngresos;
           addedCosts[r.clientId] += costo.monto * share;
         }
       });
    } else if (costo.metodoDistribucion === 'manual_cliente' && costo.clientId) {
       if (addedCosts[costo.clientId] !== undefined) {
          addedCosts[costo.clientId] += costo.monto;
       }
    }
    // manual_porcentaje is more complex, skipped for simplicity unless specified
  });

  // Apply distributed costs and recalculate margins
  const newRows = rows.map(row => {
    if (row.isAgrupador) return row; // We will recalculate agrupadores next
    
    const distributedCost = addedCosts[row.clientId] || 0;
    const finalCosto = row.costoMensual + distributedCost;
    const margenBruto = row.ingresoSinIva - finalCosto;
    const margenPorcentaje = row.ingresoSinIva > 0 ? margenBruto / row.ingresoSinIva : 0;
    
    return {
      ...row,
      costoMensual: finalCosto, // Updated cost with distributed overhead
      margenBruto,
      margenPorcentaje,
      costoPromedioPedido: row.pedidosMes > 0 ? finalCosto / row.pedidosMes : 0,
      margenPromedioPedido: row.pedidosMes > 0 ? margenBruto / row.pedidosMes : 0,
    };
  });

  // Recalculate agrupadores based on updated subclients
  return newRows.map(row => {
    if (!row.isAgrupador) return row;
    
    const subclientRows = newRows.filter(r => row.subClients?.includes(r.clientId));
    
    const pedidosMes = subclientRows.reduce((sum, r) => sum + r.pedidosMes, 0);
    const ingresoSinIva = subclientRows.reduce((sum, r) => sum + r.ingresoSinIva, 0);
    const iva = subclientRows.reduce((sum, r) => sum + r.iva, 0);
    const ingresoConIva = subclientRows.reduce((sum, r) => sum + r.ingresoConIva, 0);
    const costoMensual = subclientRows.reduce((sum, r) => sum + r.costoMensual, 0);
    
    const margenBruto = ingresoSinIva - costoMensual;
    const margenPorcentaje = ingresoSinIva > 0 ? margenBruto / ingresoSinIva : 0;
    
    return {
      ...row,
      pedidosMes,
      ingresoSinIva,
      iva,
      ingresoConIva,
      costoMensual,
      margenBruto,
      margenPorcentaje,
      ingresoPromedioPedido: pedidosMes > 0 ? ingresoSinIva / pedidosMes : 0,
      costoPromedioPedido: pedidosMes > 0 ? costoMensual / pedidosMes : 0,
      margenPromedioPedido: pedidosMes > 0 ? margenBruto / pedidosMes : 0,
    };
  });
};

export const calculateMonthlyConsolidado = (
  month: number,
  year: number,
  ufValue: number,
  orders: Order[],
  clients: Client[],
  costosGenerales: CostoGeneral[],
  costoPromedioBase: number = 3000 // default cost per order for Choferes
): ConsolidadoMensualRow[] => {
  const rows: ConsolidadoMensualRow[] = [];
  
  // Last day of month for projection logic
  const lastDay = new Date(year, month, 0);
  const configs = generateProjectionsConfig(clients, ufValue);

  // 1. Calculate standalone/subclients
  for (const client of clients) {
    if (client.isAgrupador) continue;
    
    const config = configs.find(c => c.id === client.id);
    if (!config) continue;

    // Pedidos from the real orders database!
    const accumulated = getAccumulatedOrdersByClient(orders, client.id, month, year, lastDay);
    
    let diasTrabajados = config.diasTrabajados;
    let diasMes = config.diasMes;
    
    if (!config.manualAdjustment && config.calendarType) {
      const cal = calculateWorkingDays(year, month - 1, config, lastDay);
      diasMes = cal.autoDiasMes;
      diasTrabajados = cal.autoDiasTrabajados;
    }
    
    // Revenue logic (using projection end-of-month logic, but since date is end of month, it's exact real data if month is closed)
    let proyectados = accumulated;
    if (diasTrabajados > 0 && diasTrabajados < diasMes) {
       proyectados = (accumulated / diasTrabajados) * diasMes;
    }

    const revenue = calculateClientRevenue(config as any, {
      pedidos: proyectados,
      diasTrabajados,
      valorUf: ufValue,
    });

    // Base cost is driver cost for these orders.
    const costoMensualBase = proyectados * costoPromedioBase;
    
    const margenBruto = revenue.ingresoSinIva - costoMensualBase;
    const margenPorcentaje = revenue.ingresoSinIva > 0 ? margenBruto / revenue.ingresoSinIva : 0;
    
    rows.push({
      id: client.id,
      mes: month,
      year: year,
      clientId: client.id,
      clientName: client.name,
      isAgrupador: false,
      pedidosMes: proyectados,
      ingresoSinIva: revenue.ingresoSinIva,
      iva: revenue.iva,
      ingresoConIva: revenue.ingresoConIva,
      costoMensual: costoMensualBase,
      margenBruto,
      margenPorcentaje,
      ingresoPromedioPedido: proyectados > 0 ? revenue.ingresoSinIva / proyectados : 0,
      costoPromedioPedido: proyectados > 0 ? costoMensualBase / proyectados : 0,
      margenPromedioPedido: proyectados > 0 ? margenBruto / proyectados : 0,
      variacionPedidos: 0, 
      variacionIngreso: 0,
      variacionCosto: 0,
      variacionMargen: 0,
      observaciones: config.observaciones || '',
    });
  }

  // 2. Add agrupadores placeholders (will be filled in distributeCosts)
  for (const client of clients) {
    if (!client.isAgrupador) continue;
    rows.push({
      id: client.id,
      mes: month,
      year: year,
      clientId: client.id,
      clientName: client.name,
      isAgrupador: true,
      pedidosMes: 0,
      ingresoSinIva: 0,
      iva: 0,
      ingresoConIva: 0,
      costoMensual: 0,
      margenBruto: 0,
      margenPorcentaje: 0,
      ingresoPromedioPedido: 0,
      costoPromedioPedido: 0,
      margenPromedioPedido: 0,
      variacionPedidos: 0,
      variacionIngreso: 0,
      variacionCosto: 0,
      variacionMargen: 0,
      observaciones: 'Agrupador',
      subClients: client.subClients
    });
  }

  // 3. Apply overhead costs distribution
  const finalRows = distributeCosts(rows, costosGenerales);
  
  // Sort rows properly
  const sortedRows: ConsolidadoMensualRow[] = [];
  for (const client of clients) {
    if (client.isAgrupador) {
       const ag = finalRows.find(r => r.clientId === client.id);
       if (ag) sortedRows.push(ag);
       client.subClients?.forEach(sub => {
          const subRow = finalRows.find(r => r.clientId === sub);
          if (subRow) sortedRows.push(subRow);
       });
    } else {
       const isSubclient = clients.some(c => c.isAgrupador && c.subClients?.includes(client.id));
       if (!isSubclient) {
          const r = finalRows.find(r => r.clientId === client.id);
          if (r) sortedRows.push(r);
       }
    }
  }

  return sortedRows;
};
