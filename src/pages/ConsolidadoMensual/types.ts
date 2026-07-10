export interface ConsolidadoMensualRow {
  id: string;
  mes: number; // 1-12
  year: number;
  clientId: string;
  clientName: string;
  isAgrupador: boolean;
  pedidosMes: number;
  ingresoSinIva: number;
  iva: number;
  ingresoConIva: number;
  costoMensual: number;
  margenBruto: number;
  margenPorcentaje: number;
  ingresoPromedioPedido: number;
  costoPromedioPedido: number;
  margenPromedioPedido: number;
  variacionPedidos: number; // %
  variacionIngreso: number; // %
  variacionCosto: number; // %
  variacionMargen: number; // %
  observaciones: string;
  subClients?: string[];
}

export interface CostoGeneral {
  id: string;
  mes: number;
  year: number;
  categoria: string;
  descripcion: string;
  monto: number;
  clientId?: string; // Si es nulo, es general RunBox
  metodoDistribucion: 'no_distribuir' | 'proporcional_pedidos' | 'proporcional_ingresos' | 'manual_cliente' | 'manual_porcentaje';
}
