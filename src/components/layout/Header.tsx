import React from 'react';
import { Bell, Search, DollarSign } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Header = () => {
  const { ufValue } = useAppContext();
  
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar pedidos, clientes, rutas..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
          <DollarSign className="w-4 h-4 text-indigo-600" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest leading-none">Valor UF</span>
            <span className="text-xs font-bold text-indigo-900 leading-none mt-0.5">${ufValue.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

