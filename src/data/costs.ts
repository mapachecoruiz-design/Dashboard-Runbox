export interface GeneralCost {
  id: string;
  mes: number;
  year: number;
  categoria: string;
  descripcion: string;
  monto: number;
  metodoDistribucion: 'proporcional_pedidos' | 'proporcional_ingresos' | 'equitativo';
}

export const fetchGeneralCosts = async (month: number, year: number): Promise<GeneralCost[]> => {
  // Placeholder for real data fetching
  return [
    { id: '1', mes: month, year, categoria: 'Sueldos Fijos', descripcion: 'Sueldo administración', monto: 1500000, metodoDistribucion: 'proporcional_pedidos' },
    { id: '2', mes: month, year, categoria: 'Software', descripcion: 'AWS y SaaS', monto: 350000, metodoDistribucion: 'proporcional_ingresos' },
    { id: '3', mes: month, year, categoria: 'Arriendos', descripcion: 'Bodega principal', monto: 800000, metodoDistribucion: 'proporcional_pedidos' },
  ];
};
