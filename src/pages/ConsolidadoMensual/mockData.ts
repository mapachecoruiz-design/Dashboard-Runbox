import { ConsolidadoMensualRow, CostoGeneral } from './types';
import { calculateMonthlyConsolidado, ClientMonthlyData } from '../../services/consolidadoService';
import { clients } from '../../data/clients';
import { getOrders } from '../../data/orders';

// Function instead of const so it can dynamically fetch current localstorage state
export const getConsolidadoData = (month: number, year: number, valorUf: number): ConsolidadoMensualRow[] => {
  const allOrders = getOrders();
  const monthOrders = allOrders.filter(o => {
      const d = new Date(o.deliveryDate);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  const monthlyData: ClientMonthlyData[] = clients.filter(c => !c.isAgrupador).map(client => {
    const clientOrders = monthOrders.filter(o => o.clientId === client.id);
    let pedidos = clientOrders.length;
    
    // Fallback if no real data
    if (pedidos === 0) {
      const sum = client.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      pedidos = (sum * 13) % 400 + 10;
      if (pedidos < 20) pedidos += 100;
    }

    return {
      clientId: client.id,
      pedidos,
      costoPromedioP: 2500 + (pedidos % 1000), // Mock cost until we link routes
    };
  });

  const generatedConsolidado = calculateMonthlyConsolidado(month, year, valorUf, monthlyData);

  return generatedConsolidado.map(row => ({
    ...row,
    variacionPedidos: (Math.random() * 0.4) - 0.2,
    variacionIngreso: (Math.random() * 0.4) - 0.2,
    variacionCosto: (Math.random() * 0.2) - 0.1,
    variacionMargen: (Math.random() * 0.5) - 0.25,
  }));
};

export const mockCostosGenerales: CostoGeneral[] = [
  { id: '1', mes: 7, year: 2026, categoria: 'Sueldos Fijos', descripcion: 'Sueldo administración', monto: 1500000, metodoDistribucion: 'proporcional_pedidos' },
  { id: '2', mes: 7, year: 2026, categoria: 'Software', descripcion: 'AWS y SaaS', monto: 350000, metodoDistribucion: 'proporcional_ingresos' },
  { id: '3', mes: 7, year: 2026, categoria: 'Arriendos', descripcion: 'Bodega principal', monto: 800000, metodoDistribucion: 'proporcional_pedidos' },
];
