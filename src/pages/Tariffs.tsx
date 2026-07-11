import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Lock, History as HistoryIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { BaseTariff } from '../data/tariffs';

export const Tariffs = () => {
  const { tariffs, clients } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTariff, setSelectedTariff] = useState<BaseTariff | null>(null);

  const filteredTariffs = tariffs.filter(t => {
    const clientName = clients.find(c => c.id === t.clientId)?.name.toLowerCase() || '';
    return clientName.includes(searchTerm.toLowerCase()) || 
           (t.observaciones && t.observaciones.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || id;

  const formatPrice = (t: BaseTariff) => {
    if (t.tipoTarifa === 'agrupador') return '-';
    if (t.tipoTarifa === 'formula_especial') return 'Fórmula Especial';
    if (t.tipoTarifa === 'cargo_fijo_uf_mas_variable_uf') return `${t.cargoFijo} UF + ${t.cargoVariable} UF/u`;
    if (t.tipoTarifa === 'cargo_fijo_mas_variable') return `$${t.cargoFijo} + $${t.cargoVariable}/u`;
    
    return `${t.moneda === 'CLP' ? '$' : ''}${t.precio?.toLocaleString('es-CL') || 0} ${t.moneda === 'UF' ? 'UF' : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Tarifas Maestras <Lock className="w-4 h-4 text-slate-400" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">Módulo bloqueado. Visualización de tarifas base, vigencia e historial.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Cliente (ID/Nombre)</th>
                <th className="px-6 py-3">Tipo de Tarifa</th>
                <th className="px-6 py-3">Precio Base</th>
                <th className="px-6 py-3">IVA</th>
                <th className="px-6 py-3">Vigencia</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredTariffs.map((tariff, index) => (
                <tr key={tariff.clientId + index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-slate-800">
                    {getClientName(tariff.clientId)}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-widest">
                      {tariff.tipoTarifa.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-800">
                    {formatPrice(tariff)}
                  </td>
                  <td className="px-6 py-3">
                    {tariff.aplicaIva ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Sí</span> : <span className="text-slate-400">No</span>}
                  </td>
                  <td className="px-6 py-3 text-[10px]">
                    <div className="flex flex-col space-y-1">
                      <span><strong className="text-slate-400">Desde:</strong> {tariff.validFrom || 'Inicio'}</span>
                      <span><strong className="text-slate-400">Hasta:</strong> {tariff.validTo || 'Actual'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button 
                      onClick={() => setSelectedTariff(tariff)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 transition-colors rounded flex items-center justify-center ml-auto"
                      title="Ver Detalles e Historial"
                    >
                      <HistoryIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTariffs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No se encontraron tarifas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial / Detail Modal */}
      {selectedTariff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                Historial de Tarifa - {getClientName(selectedTariff.clientId)}
              </h2>
              <button 
                onClick={() => setSelectedTariff(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
               <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                 <h3 className="text-xs font-bold uppercase text-indigo-800 mb-4 tracking-wider">Tarifa Vigente Actual</h3>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="text-indigo-400/80 text-xs mb-1">Tipo</p>
                     <p className="font-bold text-indigo-900">{selectedTariff.tipoTarifa.replace(/_/g, ' ').toUpperCase()}</p>
                   </div>
                   <div>
                     <p className="text-indigo-400/80 text-xs mb-1">Valor</p>
                     <p className="font-bold text-indigo-900">{formatPrice(selectedTariff)}</p>
                   </div>
                   <div>
                     <p className="text-indigo-400/80 text-xs mb-1">Vigencia</p>
                     <p className="font-medium text-indigo-900">
                       Desde: {selectedTariff.validFrom || 'Inicio'} <br/>
                       Hasta: {selectedTariff.validTo || 'Actual'}
                     </p>
                   </div>
                   <div>
                     <p className="text-indigo-400/80 text-xs mb-1">Observaciones</p>
                     <p className="font-medium text-indigo-900">{selectedTariff.observaciones || 'Ninguna'}</p>
                   </div>
                 </div>
               </div>

               <div>
                 <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-wider">Historial de Cambios</h3>
                 {!selectedTariff.history || selectedTariff.history.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-slate-100">
                      No hay registros anteriores para este cliente.
                    </p>
                 ) : (
                   <div className="space-y-3">
                     {selectedTariff.history.map((h, i) => (
                       <div key={i} className="border border-slate-200 rounded-lg p-3 text-sm opacity-75 bg-slate-50">
                         <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-slate-700">{formatPrice(h)}</span>
                           <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold uppercase">
                             {h.tipoTarifa.replace(/_/g, ' ')}
                           </span>
                         </div>
                         <div className="text-xs text-slate-500 flex justify-between">
                           <span>Desde: {h.validFrom || 'Inicio'}</span>
                           <span>Hasta: {h.validTo || 'Desconocido'}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedTariff(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
