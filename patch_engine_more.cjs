const fs = require('fs');
const file = 'src/services/tariffEngine.ts';
let code = fs.readFileSync(file, 'utf8');

code += `
export const calculateClientCost = (pedidos: number, costoPromedioPedido: number): number => {
  return pedidos * costoPromedioPedido;
};

export const calculateClientMargin = (ingresoSinIva: number, costoTotal: number) => {
  const margenBruto = ingresoSinIva - costoTotal;
  const margenPorcentaje = ingresoSinIva > 0 ? margenBruto / ingresoSinIva : 0;
  return { margenBruto, margenPorcentaje };
};
`;

fs.writeFileSync(file, code);
