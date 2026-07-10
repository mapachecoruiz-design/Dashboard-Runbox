import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Search, Filter, Plus, FileDown, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

export const Orders = () => {
  const { orders, clients, drivers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.commune.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'entregado': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Entregado</span>;
      case 'en_ruta': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En Ruta</span>;
      case 'fallido': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Fallido</span>;
      case 'reentrega': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Reentrega</span>;
      case 'devuelto': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Devuelto</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>;
    }
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Desconocido';
  const getDriverName = (id: string | null) => {
    if (!id) return 'No asignado';
    return drivers.find(d => d.id === id)?.name || 'Desconocido';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pedidos</h1>
          <p className="text-xs text-slate-500 mt-1">Gestión y seguimiento de entregas</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Crear Pedido
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID, dirección, comuna..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-medium text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-slate-700"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_ruta">En Ruta</option>
                <option value="entregado">Entregado</option>
                <option value="fallido">Fallido</option>
                <option value="reentrega">Reentrega</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">ID RunBox / Cliente</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3">Comuna</th>
                <th className="px-6 py-3">Chofer</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="font-bold text-slate-800">{order.id}</div>
                      <div className="text-[10px] text-slate-400">{order.clientOrderId}</div>
                    </td>
                    <td className="px-6 py-3 font-medium">{getClientName(order.clientId)}</td>
                    <td className="px-6 py-3">
                      <div className="max-w-[200px] truncate">{order.address}</div>
                    </td>
                    <td className="px-6 py-3">{order.commune}</td>
                    <td className="px-6 py-3">{getDriverName(order.driverId)}</td>
                    <td className="px-6 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-3">
                      {format(new Date(order.createdAt), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron pedidos con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando {filteredOrders.length} de {orders.length} pedidos</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};
