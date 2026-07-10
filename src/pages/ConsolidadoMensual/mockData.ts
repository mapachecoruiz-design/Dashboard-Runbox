import { ConsolidadoMensualRow, CostoGeneral } from './types';

export const mockCostosGenerales: CostoGeneral[] = [
  { id: '1', mes: 7, year: 2026, categoria: 'Sueldos Fijos', descripcion: 'Sueldo administración', monto: 1500000, metodoDistribucion: 'proporcional_pedidos' },
  { id: '2', mes: 7, year: 2026, categoria: 'Software', descripcion: 'AWS y SaaS', monto: 350000, metodoDistribucion: 'proporcional_ingresos' },
  { id: '3', mes: 7, year: 2026, categoria: 'Arriendos', descripcion: 'Bodega principal', monto: 800000, metodoDistribucion: 'proporcional_pedidos' },
];
