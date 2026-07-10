import React, { useState, useMemo } from 'react';
import { 
  PieChart, Calendar, BarChart2, Users, DollarSign, Download, Settings, Filter, FileText, Search
} from 'lucide-react';
import { cn, formatNumber, formatMoney } from '../../lib/utils';
import { mockConsolidado } from './mockData';
import { ConsolidadoMensualRow } from './types';

// Subcomponents (we will create these as simple tabs)
import { TablaConsolidado } from './TablaConsolidado';
import { ComparativoGraficos } from './ComparativoGraficos';
import { ConsolidadoCliente } from './ConsolidadoCliente';
import { CostosMensuales } from './CostosMensuales';

export const ConsolidadoMensual = () => {
  const [activeTab, setActiveTab] = useState<'tabla' | 'comparativo' | 'cliente' | 'costos' | 'anual' | 'agrupadores'>('tabla');
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  
  // Filtrar data por mes y año
  const dataMes = useMemo(() => {
    return mockConsolidado.filter(d => d.mes === selectedMonth && d.year === selectedYear);
  }, [selectedMonth, selectedYear]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Consolidado Mensual</h1>
          <p className="text-slate-500 text-sm mt-1">Análisis financiero y operativo de la empresa.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
              <option key={m} value={m}>Mes {m}</option>
            ))}
          </select>
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button className="flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-1 rounded-xl inline-flex overflow-x-auto w-full hide-scrollbar">
        {[
          { id: 'tabla', label: 'Consolidado Mensual', icon: FileText },
          { id: 'comparativo', label: 'Comparativo Mes a Mes', icon: BarChart2 },
          { id: 'cliente', label: 'Evolución por Cliente', icon: Users },
          { id: 'costos', label: 'Costos Generales', icon: DollarSign },
          { id: 'anual', label: 'Resumen Anual', icon: Calendar },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white text-indigo-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'tabla' && <TablaConsolidado data={dataMes} />}
        {activeTab === 'comparativo' && <ComparativoGraficos data={mockConsolidado} />}
        {activeTab === 'cliente' && <ConsolidadoCliente data={mockConsolidado} />}
        {activeTab === 'costos' && <CostosMensuales />}
        {activeTab === 'anual' && (
           <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 font-medium">
             Resumen anual acumulado en desarrollo.
           </div>
        )}
      </div>
    </div>
  );
};
