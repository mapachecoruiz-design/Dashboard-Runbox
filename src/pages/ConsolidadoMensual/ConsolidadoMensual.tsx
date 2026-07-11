import React, { useState, useMemo, useEffect } from 'react';
import { 
  PieChart, Calendar, BarChart2, Users, DollarSign, Download, 
  Settings, Filter, FileText, Search, Lock, CheckCircle
} from 'lucide-react';
import { cn, formatNumber, formatMoney } from '../../lib/utils';
import { useAppContext } from '../../context/AppContext';
import { ConsolidadoMensualRow, CostoGeneral } from './types';
import { calculateMonthlyConsolidado } from '../../services/consolidadoService';
import { loadFromStorage, saveToStorage } from '../../lib/storage';

// Subcomponents
import { TablaConsolidado } from './TablaConsolidado';
import { ComparativoGraficos } from './ComparativoGraficos';
import { ConsolidadoCliente } from './ConsolidadoCliente';
import { CostosMensuales } from './CostosMensuales';

export const ConsolidadoMensual = () => {
  const [activeTab, setActiveTab] = useState<'tabla' | 'comparativo' | 'cliente' | 'costos' | 'anual' | 'agrupadores'>('tabla');
  const { ufValue, orders, clients, user, tariffs } = useAppContext();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Local state for costs to pass to service
  const [costosGenerales, setCostosGenerales] = useState<CostoGeneral[]>([]);
  
  // Load costs from localStorage for simplicity
  useEffect(() => {
    const initialCosts: CostoGeneral[] = [
      { id: '1', mes: selectedMonth, year: selectedYear, categoria: 'Infraestructura', descripcion: 'AWS / MongoDB', monto: 120000, metodoDistribucion: 'proporcional_pedidos' },
      { id: '2', mes: selectedMonth, year: selectedYear, categoria: 'SaaS', descripcion: 'TrackPod', monto: 450000, metodoDistribucion: 'proporcional_pedidos' },
      { id: '3', mes: selectedMonth, year: selectedYear, categoria: 'Operación', descripcion: 'Galpón / Arriendo', monto: 800000, metodoDistribucion: 'proporcional_ingresos' }
    ];
    setCostosGenerales(loadFromStorage('runbox_costos_generales', initialCosts));
  }, [selectedMonth, selectedYear]);

  // Load closed months history
  const [closedMonths, setClosedMonths] = useState<Record<string, any>>({});
  useEffect(() => {
    setClosedMonths(loadFromStorage('runbox_monthly_closures', {}));
  }, []);

  const monthKey = `${selectedYear}-${selectedMonth}`;
  const isMonthClosed = !!closedMonths[monthKey];

  // Calculate live data or use closed data
  const dataMes = useMemo(() => {
    if (isMonthClosed) {
       return closedMonths[monthKey].data as ConsolidadoMensualRow[];
    }
    
    return calculateMonthlyConsolidado(
       tariffs,
       selectedMonth, 
       selectedYear, 
       ufValue, 
       orders, 
       clients, 
       costosGenerales.filter(c => c.mes === selectedMonth && c.year === selectedYear)
    );
  }, [tariffs, selectedMonth, selectedYear, ufValue, orders, clients, costosGenerales, isMonthClosed, closedMonths, monthKey]);

  // Cerrar Mes handler
  const handleCerrarMes = () => {
    if (window.confirm(`¿Estás seguro de cerrar el mes ${selectedMonth}-${selectedYear}? Esto congelará los cálculos y guardará los resultados permanentes.`)) {
       const newClosed = {
          ...closedMonths,
          [monthKey]: {
             closedAt: new Date().toISOString(),
             closedBy: user?.name || 'Admin',
             data: dataMes
          }
       };
      setClosedMonths(newClosed);
      saveToStorage('runbox_monthly_closures', newClosed);
    }
  };

  const handleUpdateCostos = (newCostos: CostoGeneral[]) => {
    setCostosGenerales(newCostos);
    saveToStorage('runbox_costos_generales', newCostos);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-slate-900">Consolidado Mensual</h1>
             {isMonthClosed && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                   <Lock className="w-3 h-3 mr-1" /> Mes Cerrado
                </span>
             )}
          </div>
          <p className="text-slate-500 text-sm mt-1">Análisis financiero y operativo de la empresa.</p>
          {isMonthClosed && (
             <p className="text-xs text-amber-600 mt-1">Cerrado el {new Date(closedMonths[monthKey].closedAt).toLocaleDateString()} por {closedMonths[monthKey].closedBy}</p>
          )}
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
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          {!isMonthClosed && (
            <button 
               onClick={handleCerrarMes}
               className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Cerrar Mes
            </button>
          )}
          
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
        {activeTab === 'comparativo' && <ComparativoGraficos data={dataMes} />}
        {activeTab === 'cliente' && <ConsolidadoCliente data={dataMes} />}
        {activeTab === 'costos' && (
           <CostosMensuales 
             costos={costosGenerales} 
             mes={selectedMonth} 
             year={selectedYear} 
             onUpdate={handleUpdateCostos}
             isClosed={isMonthClosed}
           />
        )}
        {activeTab === 'anual' && (
           <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 font-medium">
             Resumen anual acumulado en desarrollo.
           </div>
        )}
      </div>
    </div>
  );
};
