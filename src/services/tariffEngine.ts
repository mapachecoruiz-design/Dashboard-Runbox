import { BaseTariff } from '../data/tariffs';

export interface TariffCalculationParams {
  pedidos: number;
  diasTrabajados?: number;
  valorUf: number;
  // Para fórmulas especiales
  pedidosBazarRevistasSobre30?: number; // Para Bazar Revistas
  bultosAdicionalesEdark?: number;      // Para eDark Store
  esFlexEdark?: boolean;                // Para eDark Store
}

export interface TariffCalculationResult {
  ingresoSinIva: number;
  iva: number;
  ingresoConIva: number;
}

export const calculateClientRevenue = (
  tariff: BaseTariff,
  params: TariffCalculationParams
): TariffCalculationResult => {
  const { pedidos, diasTrabajados = 0, valorUf } = params;
  let ingresoSinIva = 0;

  if (tariff.tipoTarifa === 'agrupador') {
    // Agrupadores no tienen ingreso propio, se calcula sumando subclientes
    return { ingresoSinIva: 0, iva: 0, ingresoConIva: 0 };
  }

  // Factor de conversión a CLP
  const factorMoneda = tariff.moneda === 'UF' ? valorUf : 1;

  switch (tariff.tipoTarifa) {
    case 'fija':
      // Se cobra el precio fijo independientemente de los pedidos (o proporcional a dias si aplica, pero por ahora lo dejamos directo si dias no se especifica regla)
      // En el sistema de proyecciones actual, el fijo se multiplica por factorMoneda y si hay días trabajados vs días mes se hace la regla de 3
      // Aquí el `ingresoSinIva` base del mes es simplemente:
      ingresoSinIva = (tariff.precio || 0) * factorMoneda;
      // Si la lógica de días aplica, debería hacerse afuera o pasarse como ratio
      break;

    case 'por_pedido':
    case 'por_ruta':
      ingresoSinIva = pedidos * (tariff.precio || 0) * factorMoneda;
      break;

    case 'cargo_fijo_uf_mas_variable_uf':
      ingresoSinIva = ((tariff.cargoFijo || 0) + pedidos * (tariff.cargoVariable || 0)) * factorMoneda;
      break;

    case 'formula_especial':
      if (tariff.clientId === 'bazar_revistas') {
         // Ejemplo de logica Bazar Revistas
         const tarifa = params.pedidosBazarRevistasSobre30 ? 3500 : (tariff.precio || 2990);
         ingresoSinIva = pedidos * tarifa;
      } else if (tariff.clientId === 'el_reinal') {
         // (5 UF + MAX(0, pedidos - 30) * 0.15 UF)
         ingresoSinIva = (5 + Math.max(0, pedidos - 30) * 0.15) * valorUf;
      } else if (tariff.clientId === 'edark_store') {
         // Flex: 0.08, Bodega: 0.095. Hasta 5 bultos. Adicional 0.011 UF
         const precioBase = params.esFlexEdark ? 0.08 : 0.095;
         const bultosExtra = params.bultosAdicionalesEdark || 0;
         ingresoSinIva = pedidos * (precioBase + bultosExtra * 0.011) * valorUf;
      }
      break;
  }

  const iva = tariff.aplicaIva ? ingresoSinIva * 0.19 : 0;
  const ingresoConIva = ingresoSinIva + iva;

  return {
    ingresoSinIva,
    iva,
    ingresoConIva,
  };
};

export const calculateClientCost = (pedidos: number, costoPromedioPedido: number): number => {
  return pedidos * costoPromedioPedido;
};

export const calculateClientMargin = (ingresoSinIva: number, costoTotal: number) => {
  const margenBruto = ingresoSinIva - costoTotal;
  const margenPorcentaje = ingresoSinIva > 0 ? margenBruto / ingresoSinIva : 0;
  return { margenBruto, margenPorcentaje };
};
