import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, Eye, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export const Reports = () => {
  const { clients } = useAppContext();
  const [reportType, setReportType] = useState('cliente');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Informes Mensuales</h1>
        <p className="text-xs text-slate-500 mt-1">Generación de reportes de cierre</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Generar Nuevo Informe</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo de Informe</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setReportType('cliente')}
                    className={cn(
                      "px-3 py-2 text-xs font-bold rounded-lg border transition-colors",
                      reportType === 'cliente' 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Para Cliente
                  </button>
                  <button 
                    onClick={() => setReportType('interno')}
                    className={cn(
                      "px-3 py-2 text-xs font-bold rounded-lg border transition-colors",
                      reportType === 'interno' 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Interno RunBox
                  </button>
                </div>
              </div>

              {reportType === 'cliente' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cliente</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Seleccionar cliente...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mes</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Octubre</option>
                    <option>Septiembre</option>
                    <option>Agosto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Año</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>2023</option>
                  </select>
                </div>
              </div>

              <button className="w-full flex justify-center items-center px-4 py-2 bg-indigo-700 border border-transparent rounded-lg text-xs font-bold text-white hover:bg-indigo-800 transition-colors shadow-sm mt-2">
                <FileText className="w-4 h-4 mr-2" />
                Generar Informe
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Historial de Informes</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { name: 'Informe Mensual Booz - Septiembre 2023', type: 'Cliente', date: '01 Oct 2023' },
                { name: 'Informe Operacional RunBox - Septiembre 2023', type: 'Interno', date: '01 Oct 2023' },
                { name: 'Informe Mensual Farmaloop - Septiembre 2023', type: 'Cliente', date: '02 Oct 2023' },
                { name: 'Informe Mensual ED - Septiembre 2023', type: 'Cliente', date: '02 Oct 2023' },
              ].map((report, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-start space-x-3">
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-400 border border-slate-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{report.name}</p>
                      <div className="flex items-center text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1 space-x-3">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {report.date}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold">{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Vista Previa">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Descargar PDF">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
