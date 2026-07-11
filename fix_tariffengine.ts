import fs from 'fs';

let content = `import { BaseTariff } from '../data/tariffs';

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

  if (tariff.tipoTarifa === 'agrupador') {
    return { ingresoSinIva: 0, iva: 0, ingresoConIva: 0 };
  }

  const factorMoneda = tariff.moneda === 'UF' ? valorUf : 1;
  const tariffClientId = tariff.clientId || tariff.id;
  
  let baseAmount = 0;

  switch (tariff.tipoTarifa) {
    case 'fija':
      baseAmount = (tariff.precio || 0) * factorMoneda;
      break;
    case 'por_pedido':
    case 'por_ruta':
      baseAmount = pedidos * (tariff.precio || 0) * factorMoneda;
      break;
    case 'cargo_fijo_mas_variable':
    case 'cargo_fijo_uf_mas_variable_uf':
      baseAmount = ((tariff.cargoFijo || 0) + pedidos * (tariff.cargoVariable || 0)) * factorMoneda;
      break;
    case 'formula_especial':
      if (tariffClientId === 'bazar_revistas') {
         const promedioDiario = diasTrabajados > 0 ? pedidos / diasTrabajados : 0;
         const tarifa = promedioDiario > 30 ? 3500 : (tariff.precio || 2990);
         baseAmount = pedidos * tarifa;
      } else if (tariffClientId === 'el_reinal') {
         baseAmount = ((tariff.cargoFijo || 5) + Math.max(0, pedidos - 30) * (tariff.cargoVariable || 0.15)) * valorUf;
      } else if (tariffClientId === 'edark_store') {
         const esFlex = params.esFlexEdark !== false;
         const precioBase = esFlex ? 0.08 : 0.095;
         const bultosExtra = params.bultosAdicionalesEdark || 0;
         baseAmount = pedidos * (precioBase + bultosExtra * 0.011) * valorUf;
      }
      break;
  }

  let ingresoSinIva = 0;
  let iva = 0;
  let ingresoConIva = 0;

  if (tariff.ivaIncluido) {
    ingresoConIva = baseAmount;
    ingresoSinIva = ingresoConIva / 1.19;
    iva = ingresoConIva - ingresoSinIva;
  } else {
    ingresoSinIva = baseAmount;
    iva = tariff.aplicaIva ? ingresoSinIva * 0.19 : 0;
    ingresoConIva = ingresoSinIva + iva;
  }

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
`;

fs.writeFileSync('src/services/tariffEngine.ts', content);
