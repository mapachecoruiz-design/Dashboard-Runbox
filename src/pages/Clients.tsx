import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, MoreHorizontal, Mail, Phone, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const Clients = () => {
  const { clients } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
          <p className="text-xs text-slate-500 mt-1">Directorio y configuración comercial</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
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
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Servicios</th>
                <th className="px-6 py-3">SLA Comprometido</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="font-bold text-slate-800">{client.name}</div>
                    <div className="text-[10px] text-slate-400">ID: {client.id}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col space-y-1 text-[10px]">
                      <div className="flex items-center text-slate-500">
                        <Mail className="w-3 h-3 mr-1.5" /> contacto@{client.name.toLowerCase().replace(' ', '')}.cl
                      </div>
                      <div className="flex items-center text-slate-500">
                        <Phone className="w-3 h-3 mr-1.5" /> +56 9 1234 5678
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1 flex-wrap w-48">
                      {client.serviceType.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-widest">
                          {s.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <Activity className="w-3.5 h-3.5 text-green-500 mr-1.5" />
                      <span className="font-bold text-slate-700">{client.slaCommitted}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                      client.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {client.isActive ? 'Activo' : 'Inactivo'}
                    </span>
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
