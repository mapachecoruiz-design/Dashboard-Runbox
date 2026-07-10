import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, MoreHorizontal, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const Tariffs = () => {
  const { tariffs, clients } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTariffs = tariffs.filter(t => {
    const clientName = clients.find(c => c.id === t.clientId)?.name.toLowerCase() || '';
    return clientName.includes(searchTerm.toLowerCase()) || 
           t.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Tarifas</h1>
          <p className="text-xs text-slate-500 mt-1">Configuración de reglas de cobro por cliente</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Regla
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente o descripción..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>
          <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Descripción</th>
                <th className="px-6 py-3">Servicio</th>
                <th className="px-6 py-3">Tarifa Base</th>
                <th className="px-6 py-3">Reglas Extra</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredTariffs.map(tariff => (
                <tr key={tariff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-slate-800">
                    {getClientName(tariff.clientId)}
                  </td>
                  <td className="px-6 py-3 max-w-[250px] truncate">
                    {tariff.description}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-widest">
                      {tariff.serviceType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-800">
                    {tariff.currency === 'CLP' ? '$' : ''}{tariff.basePrice.toLocaleString('es-CL')} {tariff.currency === 'UF' ? 'UF' : ''}
                  </td>
                  <td className="px-6 py-3 text-[10px] space-y-1">
                    {tariff.extraPackagePrice && <div>Bulto extra: {tariff.extraPackagePrice} {tariff.currency}</div>}
                    {tariff.reattemptPrice !== undefined && <div>Reentrega: {tariff.reattemptPrice} {tariff.currency}</div>}
                    {!tariff.extraPackagePrice && tariff.reattemptPrice === undefined && <span className="text-slate-400">Sin reglas extra</span>}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
