import React from 'react';
import { ConsolidadoMensualRow } from './types';
import { formatNumber, formatMoney, cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const TablaConsolidado = ({ data }: { data: ConsolidadoMensualRow[] }) => {
  // Calculate totals only using non-agrupador rows to avoid double counting
  const totals = data.filter(row => !row.isAgrupador).reduce((acc, row) => ({
    pedidos: acc.pedidos + row.pedidosMes,
    ingresoSinIva: acc.ingresoSinIva + row.ingresoSinIva,
    costoMensual: acc.costoMensual + row.costoMensual,
    margenBruto: acc.margenBruto + row.margenBruto,
  }), { pedidos: 0, ingresoSinIva: 0, costoMensual: 0, margenBruto: 0 });

  const margenPorcentajeTotal = totals.ingresoSinIva > 0 ? totals.margenBruto / totals.ingresoSinIva : 0;
  const agrupadores = data.filter(d => d.isAgrupador);
  const subclientIds = new Set(agrupadores.flatMap(a => a.subClients || []));
  
  const getTopClient = (metric: 'pedidosMes' | 'ingresoSinIva' | 'margenPorcentaje') => {
    if (data.length === 0) return null;
    return [...data].sort((a, b) => b[metric] - a[metric])[0];
  };
  const getBottomClient = (metric: 'margenPorcentaje') => {
    if (data.length === 0) return null;
    return [...data].sort((a, b) => a[metric] - b[metric])[0];
  };

  const VariationPill = ({ value }: { value: number }) => {
    if (value > 0) return <span className="flex items-center text-[10px] text-emerald-600 font-bold"><TrendingUp className="w-3 h-3 mr-0.5"/>+{(value * 100).toFixed(1)}%</span>;
    if (value < 0) return <span className="flex items-center text-[10px] text-red-600 font-bold"><TrendingDown className="w-3 h-3 mr-0.5"/>{(value * 100).toFixed(1)}%</span>;
    return <span className="flex items-center text-[10px] text-slate-400 font-bold"><Minus className="w-3 h-3 mr-0.5"/>0%</span>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Pedidos</div>
          <div className="text-2xl font-bold text-slate-900 truncate">{formatNumber(totals.pedidos)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Total Ingresos</div>
          <div className="text-2xl font-bold text-indigo-700 truncate">${formatMoney(totals.ingresoSinIva)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1">Total Costos</div>
          <div className="text-2xl font-bold text-rose-700 truncate">${formatMoney(totals.costoMensual)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Margen Total</div>
          <div className="text-2xl font-bold text-emerald-700 truncate">${formatMoney(totals.margenBruto)}</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl shadow-sm text-white flex flex-col justify-center items-center">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Margen %</div>
          <div className="text-3xl font-bold text-white">{(margenPorcentajeTotal * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Cliente</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right">Pedidos</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right text-indigo-700">Ingreso (Sin IVA)</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right text-rose-700">Costo Total</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right text-emerald-700">Margen</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right">Margen %</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right hidden lg:table-cell">Ing. Prom/Ped</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right hidden lg:table-cell">Costo Prom/Ped</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs hidden xl:table-cell">Var. Ingreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => {
                const isSubclient = subclientIds.has(row.clientId);
                return (
                <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", row.isAgrupador ? "bg-indigo-50/30" : "")}>
                  <td className="px-4 py-3">
                    <div className={cn("font-bold text-slate-900 flex items-center", isSubclient ? "ml-4 text-slate-600" : "")}>
                      {isSubclient && <span className="text-slate-300 mr-2">↳</span>}
                      {row.clientName}
                    </div>
                    {row.isAgrupador && <div className="text-[9px] text-indigo-500 font-bold uppercase mt-0.5">Agrupador</div>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-700">{formatNumber(row.pedidosMes)}</div>
                    <div className="flex justify-end mt-0.5"><VariationPill value={row.variacionPedidos} /></div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-indigo-700">${formatMoney(row.ingresoSinIva)}</div>
                    <div className="flex justify-end mt-0.5"><VariationPill value={row.variacionIngreso} /></div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-rose-700">${formatMoney(row.costoMensual)}</div>
                    <div className="flex justify-end mt-0.5"><VariationPill value={row.variacionCosto} /></div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-emerald-700">${formatMoney(row.margenBruto)}</div>
                    <div className="flex justify-end mt-0.5"><VariationPill value={row.variacionMargen} /></div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-700">
                    {(row.margenPorcentaje * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-500 hidden lg:table-cell">
                    ${formatMoney(row.ingresoPromedioPedido)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-500 hidden lg:table-cell">
                    ${formatMoney(row.costoPromedioPedido)}
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <VariationPill value={row.variacionIngreso} />
                  </td>
                </tr>
              );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">No hay datos para este mes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
