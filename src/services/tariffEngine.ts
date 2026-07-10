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
  tariff: BaseTariff | any,
  params: TariffCalculationParams
): TariffCalculationResult => {
  const { pedidos, diasTrabajados = 0, valorUf } = params;
  let ingresoSinIva = 0;

  if (tariff.tipoTarifa === 'agrupador') {
    return { ingresoSinIva: 0, iva: 0, ingresoConIva: 0 };
  }

  const factorMoneda = tariff.moneda === 'UF' ? valorUf : 1;
  const tariffClientId = tariff.clientId || tariff.id;

  switch (tariff.tipoTarifa) {
    case 'fija':
      ingresoSinIva = (tariff.precio || 0) * factorMoneda;
      break;
    case 'por_pedido':
    case 'por_ruta':
      ingresoSinIva = pedidos * (tariff.precio || 0) * factorMoneda;
      break;
    case 'cargo_fijo_mas_variable':
    case 'cargo_fijo_uf_mas_variable_uf':
      ingresoSinIva = ((tariff.cargoFijo || 0) + pedidos * (tariff.cargoVariable || 0)) * factorMoneda;
      break;
    case 'formula_especial':
      if (tariffClientId === 'bazar_revistas') {
         const promedioDiario = diasTrabajados > 0 ? pedidos / diasTrabajados : 0;
         const tarifa = promedioDiario > 30 ? 3500 : (tariff.precio || 2990);
         ingresoSinIva = pedidos * tarifa;
      } else if (tariffClientId === 'el_reinal') {
         ingresoSinIva = ((tariff.cargoFijo || 5) + Math.max(0, pedidos - 30) * (tariff.cargoVariable || 0.15)) * valorUf;
      } else if (tariffClientId === 'edark_store') {
         const esFlex = params.esFlexEdark !== false;
         const precioBase = esFlex ? 0.08 : 0.095;
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
