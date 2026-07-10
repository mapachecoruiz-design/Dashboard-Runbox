import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Map as MapIcon, MoreHorizontal, TrendingUp, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export const RoutesPage = () => {
  const { routes, drivers, clients } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoutes = routes.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.communes.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDriverName = (id: string) => drivers.find(d => d.id === id)?.name || 'Desconocido';
  const getClientName = (id?: string) => id ? clients.find(c => c.id === id)?.name || 'Múltiples' : 'Múltiples';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizada': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Finalizada</span>;
      case 'en_curso': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Curso</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Creada</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Rutas</h1>
          <p className="text-xs text-slate-500 mt-1">Gestión de rutas y rentabilidad</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm w-fit">
            <MapIcon className="w-4 h-4 mr-2" />
            Armar Ruta
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID, comuna..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>
          <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">ID Ruta</th>
                <th className="px-6 py-3">Chofer</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Comunas</th>
                <th className="px-6 py-3 text-center">Progreso</th>
                <th className="px-6 py-3 text-right">Rentabilidad</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredRoutes.map(route => {
                const progress = (route.deliveredCount / route.ordersCount) * 100;
                const marginPercent = ((route.revenue - route.cost) / route.revenue) * 100;

                return (
                  <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="font-bold text-slate-800">{route.id}</div>
                      <div className="text-[10px] text-slate-400">
                        {format(new Date(route.date), "dd MMM yyyy", { locale: es })}
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{getDriverName(route.driverId)}</td>
                    <td className="px-6 py-3">{getClientName(route.clientId)}</td>
                    <td className="px-6 py-3">
                      <div className="max-w-[200px] truncate">
                        {route.communes.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 mb-1">
                          {route.deliveredCount} / {route.ordersCount}
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", progress === 100 ? "bg-green-500" : "bg-indigo-500")} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="font-bold text-indigo-700">${route.margin.toLocaleString('es-CL')}</div>
                      <div className="text-[10px] font-bold flex items-center justify-end text-green-600 mt-0.5">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {marginPercent.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-3">{getStatusBadge(route.status)}</td>
                    <td className="px-6 py-3 text-right">
                      <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
