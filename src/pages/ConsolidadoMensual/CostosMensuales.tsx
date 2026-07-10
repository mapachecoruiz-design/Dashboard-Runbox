import React, { useState } from 'react';
import { formatMoney } from '../../lib/utils';
import { Plus, X, Check } from 'lucide-react';
import { CostoGeneral } from './types';

interface Props {
  costos: CostoGeneral[];
  mes: number;
  year: number;
  onUpdate: (costos: CostoGeneral[]) => void;
  isClosed: boolean;
}

export const CostosMensuales: React.FC<Props> = ({ costos, mes, year, onUpdate, isClosed }) => {
  const currentCostos = costos.filter(c => c.mes === mes && c.year === year);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Partial<CostoGeneral>>({
    categoria: '', descripcion: '', monto: 0, metodoDistribucion: 'proporcional_pedidos'
  });

  const handleAdd = () => {
    if (!form.categoria || !form.descripcion || !form.monto) return;
    
    const newCosto: CostoGeneral = {
      id: Math.random().toString(36).substr(2, 9),
      mes,
      year,
      categoria: form.categoria,
      descripcion: form.descripcion,
      monto: Number(form.monto),
      metodoDistribucion: form.metodoDistribucion as any,
      clientId: form.clientId
    };
    
    onUpdate([...costos, newCosto]);
    setIsAdding(false);
    setForm({ categoria: '', descripcion: '', monto: 0, metodoDistribucion: 'proporcional_pedidos' });
  };

  const handleDelete = (id: string) => {
    onUpdate(costos.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900">Costos Generales del Mes</h2>
          <p className="text-xs text-slate-500">Agrega y distribuye costos que no son directos de un pedido o ruta.</p>
        </div>
        {!isClosed && (
          <button onClick={() => setIsAdding(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Costo
          </button>
        )}
      </div>

      {isAdding && !isClosed && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Categoría</label>
            <input type="text" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="px-3 py-2 border rounded text-sm w-40" placeholder="Ej: Arriendo" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Descripción</label>
            <input type="text" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="px-3 py-2 border rounded text-sm w-64" placeholder="Ej: Oficina central" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Monto ($)</label>
            <input type="number" value={form.monto || ''} onChange={e => setForm({...form, monto: Number(e.target.value)})} className="px-3 py-2 border rounded text-sm w-32" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Regla de Distribución</label>
            <select value={form.metodoDistribucion} onChange={e => setForm({...form, metodoDistribucion: e.target.value as any})} className="px-3 py-2 border rounded text-sm w-48 bg-white">
              <option value="no_distribuir">No distribuir</option>
              <option value="proporcional_pedidos">Proporcional a pedidos</option>
              <option value="proporcional_ingresos">Proporcional a ingresos</option>
              <option value="manual_cliente">Asignación manual a cliente</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"><Check className="w-5 h-5"/></button>
            <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"><X className="w-5 h-5"/></button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Categoría</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Descripción</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs text-right">Monto</th>
              <th className="px-4 py-3 font-bold uppercase tracking-wider text-xs">Regla de Distribución</th>
              {!isClosed && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentCostos.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-sm text-slate-500">No hay costos agregados este mes</td></tr>
            ) : currentCostos.map(costo => (
              <tr key={costo.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-bold text-slate-900">{costo.categoria}</td>
                <td className="px-4 py-3 text-slate-600">{costo.descripcion}</td>
                <td className="px-4 py-3 text-right font-bold text-rose-700">${formatMoney(costo.monto)}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                    {costo.metodoDistribucion.replace(/_/g, ' ')}
                  </span>
                </td>
                {!isClosed && (
                  <td className="px-4 py-3 text-right">
                     <button onClick={() => handleDelete(costo.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
