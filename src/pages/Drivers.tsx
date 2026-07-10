import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, MoreHorizontal, Truck, DollarSign, Upload, FileSpreadsheet } from 'lucide-react';
import { cn } from '../lib/utils';

export const Drivers = () => {
  const { drivers } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'manual' | 'excel' | null>(null);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Choferes</h1>
          <p className="text-xs text-slate-500 mt-1">Gestión de flota y pagos</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setAddMode('excel'); setIsAddModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm w-fit"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar Excel
          </button>
          <button 
            onClick={() => { setAddMode('manual'); setIsAddModalOpen(true); }}
            className="flex items-center px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm w-fit"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Chofer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar chofer..." 
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
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Contacto</th>
                <th className="px-6 py-3">Tipo Pago</th>
                <th className="px-6 py-3">Tarifa / Sueldo</th>
                <th className="px-6 py-3">Reglas Variables</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredDrivers.map(driver => (
                <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mr-3">
                        <Truck className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{driver.name}</div>
                        <div className="text-[10px] text-slate-400">ID: {driver.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">{driver.phone || '-'}</td>
                  <td className="px-6 py-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-widest">
                      {driver.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col space-y-0.5">
                      {driver.fixedSalary > 0 && (
                        <span className="font-bold text-slate-800 flex items-center">
                          ${driver.fixedSalary.toLocaleString('es-CL')} <span className="text-[10px] text-slate-400 ml-1 font-medium">/mes</span>
                        </span>
                      )}
                      {driver.tariffPerRoute > 0 && (
                        <span className="font-bold text-slate-800 flex items-center">
                          ${driver.tariffPerRoute.toLocaleString('es-CL')} <span className="text-[10px] text-slate-400 ml-1 font-medium">/ruta</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="max-w-[200px] truncate">
                      {driver.variablePaymentRules || driver.notes || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                      driver.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {driver.isActive ? 'Activo' : 'Inactivo'}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {addMode === 'manual' ? 'Agregar Chofer Manualmente' : 'Importar Choferes por Excel'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {addMode === 'manual' 
                    ? 'Ingresa los datos del nuevo chofer.'
                    : 'Sube un archivo .xlsx con los choferes y sus tarifas.'}
                </p>
              </div>
            </div>
            
            <div className="p-6">
              {addMode === 'manual' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                    <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="+56 9 ..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Pago</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                      <option value="fijo">Fijo Mensual</option>
                      <option value="variable">Variable por Ruta</option>
                      <option value="mixto">Mixto</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50/50">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-700 text-center">
                    Arrastra tu archivo aquí o haz clic para subir
                  </p>
                  <p className="text-xs text-slate-500 mt-1">.xlsx o .csv hasta 10MB</p>
                  <button className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Seleccionar Archivo
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {addMode === 'manual' ? 'Guardar Chofer' : 'Importar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
