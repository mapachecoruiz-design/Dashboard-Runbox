import { ConsolidadoMensualRow, CostoGeneral } from './types';
import { initialProjectionsConfig, getMockAccumulatedOrders } from '../../data/mockProjections';

export const mockConsolidado: ConsolidadoMensualRow[] = initialProjectionsConfig.map(config => {
  const isAgrupador = config.tipoTarifa === 'agrupador';
  let pedidos = getMockAccumulatedOrders(config.id);
  if (pedidos === 0) pedidos = Math.floor(Math.random() * 500) + 50;
  
  let ingresoSinIva = 0;
  if (config.tipoTarifa === 'por_pedido') {
    ingresoSinIva = pedidos * (config.moneda === 'UF' ? config.precio * 37000 : config.precio);
  } else if (config.tipoTarifa === 'fija') {
    ingresoSinIva = config.moneda === 'UF' ? config.precio * 37000 : config.precio;
  } else if (config.tipoTarifa === 'cargo_fijo_uf_mas_variable_uf') {
    ingresoSinIva = ((config.cargoFijo || 0) + (pedidos * (config.cargoVariable || 0))) * 37000;
  }
  
  const costoPromedioP = Math.floor(Math.random() * 1000) + 1500;
  const costoMensual = pedidos * costoPromedioP;
  
  const iva = config.aplicaIva ? ingresoSinIva * 0.19 : 0;
  const ingresoConIva = ingresoSinIva + iva;
  const margenBruto = ingresoSinIva - costoMensual;
  const margenPorcentaje = ingresoSinIva > 0 ? margenBruto / ingresoSinIva : 0;
  
  return {
    id: config.id,
    mes: 7,
    year: 2026,
    clientId: config.id,
    clientName: config.name,
    isAgrupador,
    pedidosMes: pedidos,
    ingresoSinIva,
    iva,
    ingresoConIva,
    costoMensual,
    margenBruto,
    margenPorcentaje,
    ingresoPromedioPedido: pedidos > 0 ? ingresoSinIva / pedidos : 0,
    costoPromedioPedido: pedidos > 0 ? costoMensual / pedidos : 0,
    margenPromedioPedido: pedidos > 0 ? margenBruto / pedidos : 0,
    variacionPedidos: (Math.random() * 0.4) - 0.2,
    variacionIngreso: (Math.random() * 0.4) - 0.2,
    variacionCosto: (Math.random() * 0.2) - 0.1,
    variacionMargen: (Math.random() * 0.5) - 0.25,
    observaciones: config.observaciones || '',
    subClients: config.subClients
  };
});

mockConsolidado.forEach(row => {
  if (row.isAgrupador && row.subClients) {
     const subs = mockConsolidado.filter(c => row.subClients?.includes(c.id));
     row.pedidosMes = subs.reduce((acc, s) => acc + s.pedidosMes, 0);
     row.ingresoSinIva = subs.reduce((acc, s) => acc + s.ingresoSinIva, 0);
     row.iva = subs.reduce((acc, s) => acc + s.iva, 0);
     row.ingresoConIva = subs.reduce((acc, s) => acc + s.ingresoConIva, 0);
     row.costoMensual = subs.reduce((acc, s) => acc + s.costoMensual, 0);
     row.margenBruto = row.ingresoSinIva - row.costoMensual;
     row.margenPorcentaje = row.ingresoSinIva > 0 ? row.margenBruto / row.ingresoSinIva : 0;
     row.ingresoPromedioPedido = row.pedidosMes > 0 ? row.ingresoSinIva / row.pedidosMes : 0;
     row.costoPromedioPedido = row.pedidosMes > 0 ? row.costoMensual / row.pedidosMes : 0;
     row.margenPromedioPedido = row.pedidosMes > 0 ? row.margenBruto / row.pedidosMes : 0;
  }
});

export const mockCostosGenerales: CostoGeneral[] = [
  { id: '1', mes: 7, year: 2026, categoria: 'Sueldos Fijos', descripcion: 'Sueldo administración', monto: 1500000, metodoDistribucion: 'proporcional_pedidos' },
  { id: '2', mes: 7, year: 2026, categoria: 'Software', descripcion: 'AWS y SaaS', monto: 350000, metodoDistribucion: 'proporcional_ingresos' },
  { id: '3', mes: 7, year: 2026, categoria: 'Arriendos', descripcion: 'Bodega principal', monto: 800000, metodoDistribucion: 'proporcional_pedidos' },
];
