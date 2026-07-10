import React, { useState } from 'react';
import { mockCostosGenerales } from './mockData';
import { formatMoney } from '../../lib/utils';
import { Plus } from 'lucide-react';

export const CostosMensuales = () => {
  const [costos, setCostos] = useState(mockCostosGenerales);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900">Costos Generales del Mes</h2>
          <p className="text-xs text-slate-500">Agrega y distribuye costos que no son directos de un pedido o ruta.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Costo
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Categoría</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Descripción</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right">Monto</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Regla de Distribución</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {costos.map(costo => (
              <tr key={costo.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">{costo.categoria}</td>
                <td className="px-4 py-3 text-slate-600">{costo.descripcion}</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">${formatMoney(costo.monto)}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                    {costo.metodoDistribucion.replace(/_/g, ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
