const fs = require('fs');

const code = `import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Edit2, Check, X, FileSpreadsheet, LayoutDashboard, List, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { calculateClientRevenue } from '../services/tariffEngine';
import { calculateWorkingDays } from '../utils/calendar';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClientProjectionConfig, TariffType } from '../data/mockProjections';
import { getAccumulatedOrdersByClient, generateProjectionsConfig } from '../services/projectionsService';

type CalculatedProjection = ClientProjectionConfig & {
  autoDiasMes?: number;
  autoDiasTrabajados?: number;
  calendarTypeStr?: string;
  accumulated: number;
  valid: boolean;
  promDiario: number;
  proyectados: number;
  sinIva: number;
  iva: number;
  conIva: number;
};

const calculateProjection = (config: ClientProjectionConfig, accumulated: number, globalUf: number, currentDate: Date): CalculatedProjection => {
  let diasTrabajados = config.diasTrabajados;
  let diasMes = config.diasMes;
  let autoDiasMes = diasMes;
  let autoDiasTrabajados = diasTrabajados;
  let calendarTypeStr = 'Normal';

  if (!config.manualAdjustment && config.calendarType) {
    const { autoDiasMes: adm, autoDiasTrabajados: adt } = calculateWorkingDays(currentDate.getFullYear(), currentDate.getMonth(), config, currentDate);
    diasMes = adm;
    diasTrabajados = adt;
    autoDiasMes = adm;
    autoDiasTrabajados = adt;
    calendarTypeStr = config.calendarType.replace(/_/g, ' a ');
  } else if (config.manualAdjustment) {
     calendarTypeStr = 'Ajuste manual';
  }

  if (config.tipoTarifa === 'agrupador') {
    return { ...config, accumulated, valid: true, promDiario: 0, proyectados: 0, sinIva: 0, iva: 0, conIva: 0, autoDiasMes, autoDiasTrabajados, calendarTypeStr, diasTrabajados, diasMes };
  }

  if (!diasTrabajados || diasTrabajados <= 0) {
    return { ...config, accumulated, valid: false, promDiario: 0, proyectados: 0, sinIva: 0, iva: 0, conIva: 0, autoDiasMes, autoDiasTrabajados, calendarTypeStr, diasTrabajados, diasMes };
  }
  
  const promDiario = accumulated / diasTrabajados;
  const proyectados = promDiario * diasMes;

  const revenueResult = calculateClientRevenue(config as any, {
    pedidos: proyectados,
    diasTrabajados,
    valorUf: globalUf,
  });

  return {
    ...config,
    accumulated,
    valid: true,
    promDiario,
    proyectados,
    sinIva: revenueResult.ingresoSinIva,
    iva: revenueResult.iva,
    conIva: revenueResult.ingresoConIva,
    autoDiasMes,
    autoDiasTrabajados,
    calendarTypeStr,
    diasTrabajados,
    diasMes
  };
};

export const Projections = () => {
  const { ufValue, clients, orders } = useAppContext();
  
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterCutoffDate, setFilterCutoffDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterClientId, setFilterClientId] = useState('');
  const [showAgrupadores, setShowAgrupadores] = useState(true);

  // Initialize and persist configs in local state to allow manual adjustments
  const [configs, setConfigs] = useState<ClientProjectionConfig[]>([]);

  useEffect(() => {
    // Only generate configs if empty, or we could merge new clients. 
    // For simplicity, we just initialize once or when clients length changes.
    if (configs.length !== clients.length) {
       setConfigs(generateProjectionsConfig(clients, ufValue));
    }
  }, [clients, ufValue, configs.length]);

  const [activeTab, setActiveTab] = useState<'tabla' | 'tarjetas' | 'resumen' | 'comparativa' | 'historico'>('tabla');  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ClientProjectionConfig | null>(null);

  const accumulatedData = useMemo(() => {
    const data: Record<string, number> = {};
    const cutoff = new Date(filterCutoffDate + 'T23:59:59'); // end of selected cutoff day
    configs.forEach(c => {
      data[c.id] = getAccumulatedOrdersByClient(orders, c.id, filterMonth, filterYear, cutoff);
    });
    return data;
  }, [configs, orders, filterMonth, filterYear, filterCutoffDate]);

  const calculated = useMemo(() => {
    const cutoff = new Date(filterCutoffDate + 'T23:59:59');
    // Ensure we trick calculateProjection to use the right month for days calculation
    // By passing a date that is within the selected month and year, up to the cutoff date day.
    let refDate = cutoff;
    if (cutoff.getMonth() + 1 !== filterMonth || cutoff.getFullYear() !== filterYear) {
      // If cutoff is outside the month, just use the end of the selected month
      refDate = new Date(filterYear, filterMonth, 0); 
    }

    const normal = configs.filter(c => c.tipoTarifa !== 'agrupador').map(c => calculateProjection(c, accumulatedData[c.id] || 0, ufValue, refDate));
    
    const grouped = configs.filter(c => c.tipoTarifa === 'agrupador').map(c => {
       const subs = normal.filter(n => c.subClients?.includes(n.id));
       const accumulated = subs.reduce((sum, s) => sum + s.accumulated, 0);
       const proyectados = subs.reduce((sum, s) => sum + s.proyectados, 0);
       const sinIva = subs.reduce((sum, s) => sum + s.sinIva, 0);
       const iva = subs.reduce((sum, s) => sum + s.iva, 0);
       const conIva = subs.reduce((sum, s) => sum + s.conIva, 0);
       const calInfo = calculateProjection(c, accumulated, ufValue, refDate);
       return { ...c, accumulated, valid: true, promDiario: 0, proyectados, sinIva, iva, conIva, autoDiasMes: calInfo.autoDiasMes, autoDiasTrabajados: calInfo.autoDiasTrabajados, calendarTypeStr: calInfo.calendarTypeStr, diasTrabajados: calInfo.diasTrabajados, diasMes: calInfo.diasMes } as CalculatedProjection;
    });

    let result = configs.map(c => c.tipoTarifa === 'agrupador' ? grouped.find(g => g.id === c.id)! : normal.find(n => n.id === c.id)!);
    
    if (filterClientId) {
       result = result.filter(c => c.id === filterClientId || c.subClients?.includes(filterClientId));
    }
    if (!showAgrupadores) {
       result = result.filter(c => c.tipoTarifa !== 'agrupador');
    }
    return result;
  }, [configs, accumulatedData, ufValue, filterMonth, filterYear, filterCutoffDate, filterClientId, showAgrupadores]);

  const totals = useMemo(() => {
    return calculated.reduce((acc, curr) => {
      // Avoid double counting if showAgrupadores is true and subclients are also present
      // For totals, it is always safer to sum only non-agrupadores OR only agrupadores + standalone
      if (curr.tipoTarifa === 'agrupador') return acc; 
      
      // Only sum non-agrupadores that are not subclients if we want standalone totals, 
      // but actually the requested standard is just to sum all non-agrupadores for the global total.
      return {
        accumulated: acc.accumulated + curr.accumulated,
        proyectados: acc.proyectados + curr.proyectados,
        sinIva: acc.sinIva + curr.sinIva,
        iva: acc.iva + curr.iva,
        conIva: acc.conIva + curr.conIva
      };
    }, { accumulated: 0, proyectados: 0, sinIva: 0, iva: 0, conIva: 0 });
  }, [calculated]);

  const rankingByProyectados = [...calculated]
    .filter(c => c.tipoTarifa !== 'agrupador' && c.valid)
    .sort((a, b) => b.proyectados - a.proyectados);

  const rankingByMonto = [...calculated]
    .filter(c => c.tipoTarifa !== 'agrupador' && c.valid)
    .sort((a, b) => b.sinIva - a.sinIva);

  const topMonto = rankingByMonto[0];
  const topVolumen = rankingByProyectados[0];

  const handleEditClick = (config: ClientProjectionConfig) => {
    setEditingId(config.id);
    setEditForm({ ...config });
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    setConfigs(prev => prev.map(c => c.id === editForm.id ? { ...editForm, manualAdjustment: true } : c));
    setEditingId(null);
    setEditForm(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const formatMoney = (val: number) => Math.round(val).toLocaleString('es-CL');
  const formatNumber = (val: number) => Math.round(val).toLocaleString('es-CL');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Proyecciones por Cliente</h1>
          <p className="text-xs text-slate-500 mt-1">Cálculo individual de pedidos y facturación estimada</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('tabla')}
            className={cn("px-4 py-2 rounded-md text-xs font-bold transition-colors", activeTab === 'tabla' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            1. Proyección mensual
          </button>
          <button 
            onClick={() => setActiveTab('tarjetas')}
            className={cn("px-4 py-2 rounded-md text-xs font-bold transition-colors", activeTab === 'tarjetas' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            2. Tarjetas por cliente
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div>
           <label className="block text-xs font-bold text-slate-600 mb-1">Mes</label>
           <select value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
             {Array.from({length: 12}).map((_, i) => <option key={i+1} value={i+1}>{new Date(2026, i).toLocaleString('es', {month: 'long'})}</option>)}
           </select>
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-600 mb-1">Año</label>
           <select value={filterYear} onChange={e => setFilterYear(Number(e.target.value))} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
             {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
           </select>
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-600 mb-1">Fecha de corte</label>
           <input type="date" value={filterCutoffDate} onChange={e => setFilterCutoffDate(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-600 mb-1">Cliente</label>
           <select value={filterClientId} onChange={e => setFilterClientId(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
             <option value="">Todos</option>
             {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
        </div>
        <div className="flex items-center h-[38px]">
           <label className="flex items-center cursor-pointer">
             <input type="checkbox" checked={showAgrupadores} onChange={e => setShowAgrupadores(e.target.checked)} className="sr-only peer" />
             <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
             <span className="ml-3 text-sm font-bold text-slate-700">Agrupadores</span>
           </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center text-slate-500 mb-2">
            <Package className="w-4 h-4 mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pedidos Acumulados</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{formatNumber(totals.accumulated)}</div>
          <p className="text-[10px] font-medium text-slate-500 mt-1">Hasta la fecha</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center text-indigo-500 mb-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Pedidos Proyectados</span>
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-2">{formatNumber(totals.proyectados)}</div>
          <p className="text-[10px] font-medium text-indigo-400 mt-1">Fin de mes</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center text-emerald-500 mb-2">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Monto Proyectado</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">${formatMoney(totals.sinIva)} <span className="text-xs text-emerald-500 font-medium">+ IVA</span></div>
          <p className="text-[10px] font-medium text-emerald-500 mt-1">Total con IVA: ${formatMoney(totals.conIva)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Top 10 Clientes por Monto Proyectado</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingByMonto.slice(0, 10).map(c => ({ name: c.name, monto: c.sinIva }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} tickFormatter={(val) => \`\$\${(val/1000000).toFixed(1)}M\`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} formatter={(val: number) => \`\$\${formatMoney(val)}\`} />
                <Bar dataKey="monto" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Top 10 Clientes por Pedidos Proyectados</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingByProyectados.slice(0, 10).map(c => ({ name: c.name, pedidos: c.proyectados }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} formatter={(val: number) => formatNumber(val)} />
                <Bar dataKey="pedidos" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {activeTab === 'tabla' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Cliente / Tipo</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-center">Config Días</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Pedidos Acum.</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Prom. Diario</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Proyección<br/><span className="text-[10px] text-slate-400 font-normal lowercase">Fin de mes</span></th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Ingreso<br/><span className="text-[10px] text-slate-400 font-normal lowercase">Sin IVA</span></th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Facturación<br/><span className="text-[10px] text-slate-400 font-normal lowercase">Con IVA</span></th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculated.map(row => (
                  <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", row.tipoTarifa === 'agrupador' ? "bg-slate-50/50" : "")}>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{row.name}</div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{row.tipoTarifa.replace(/_/g, ' ')}</div>
                    </td>
                    <td className="p-4 text-center">
                      {!row.valid ? (
                         <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold"><AlertCircle className="w-3 h-3 mr-1"/> Días 0</span>
                      ) : (
                         <div className="inline-flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-700">{row.diasTrabajados} / {row.diasMes}</span>
                            <span className="text-[10px] text-slate-400">{row.calendarTypeStr}</span>
                         </div>
                      )}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-700">{formatNumber(row.accumulated)}</td>
                    <td className="p-4 text-right font-medium text-slate-700">{row.tipoTarifa === 'agrupador' ? '-' : row.promDiario.toFixed(1)}</td>
                    <td className="p-4 text-right font-bold text-indigo-700">{formatNumber(row.proyectados)}</td>
                    <td className="p-4 text-right font-bold text-emerald-600">${formatMoney(row.sinIva)}</td>
                    <td className="p-4 text-right font-bold text-slate-900">${formatMoney(row.conIva)}</td>
                    <td className="p-4 text-right">
                      {row.tipoTarifa !== 'agrupador' && (
                        <button onClick={() => handleEditClick(row)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tarjetas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           {calculated.map(row => (
              <div key={row.id} className={cn("bg-white p-5 rounded-xl shadow-sm border", row.tipoTarifa === 'agrupador' ? "border-indigo-200" : "border-slate-200")}>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="font-bold text-slate-900 leading-tight">{row.name}</h3>
                       <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">{row.tipoTarifa.replace(/_/g, ' ')}</span>
                    </div>
                    {row.tipoTarifa !== 'agrupador' && (
                       <button onClick={() => handleEditClick(row)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4"/></button>
                    )}
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                       <span className="text-xs text-slate-500 font-medium">Acumulados ({row.diasTrabajados}d)</span>
                       <span className="font-bold text-slate-700">{formatNumber(row.accumulated)}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                       <span className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Proyectados</span>
                       <span className="font-bold text-indigo-700">{formatNumber(row.proyectados)}</span>
                    </div>
                    <div className="flex justify-between items-end pt-1">
                       <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Facturación</span>
                       <span className="font-bold text-emerald-700">${formatMoney(row.conIva)}</span>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {editingId && editForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Ajustar Proyección: {editForm.name}</h2>
                <p className="text-xs text-slate-500 mt-1">Configura las variables para afinar el cálculo estimado.</p>
              </div>
              <button onClick={handleCancelEdit} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Días trabajados (hasta la fecha)</label>
                  <input type="number" value={editForm.diasTrabajados} onChange={e => setEditForm({...editForm, diasTrabajados: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Días a trabajar en el mes</label>
                  <input type="number" value={editForm.diasMes} onChange={e => setEditForm({...editForm, diasMes: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-4">Configuración de Tarifa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tipo de Tarifa</label>
                    <select value={editForm.tipoTarifa} onChange={e => setEditForm({...editForm, tipoTarifa: e.target.value as TariffType})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                      <option value="por_pedido">Precio por pedido</option>
                      <option value="fija">Tarifa fija</option>
                      <option value="cargo_fijo_mas_variable">Cargo Fijo + Variable</option>
                      <option value="cargo_fijo_uf_mas_variable_uf">Cargo Fijo UF + Variable UF</option>
                      <option value="agrupador">Agrupador (Sin cálculo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Moneda</label>
                    <select value={editForm.moneda} onChange={e => setEditForm({...editForm, moneda: e.target.value as 'CLP' | 'UF'})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
                      <option value="CLP">CLP</option>
                      <option value="UF">UF</option>
                    </select>
                  </div>
                  
                  {editForm.tipoTarifa !== 'agrupador' && (
                    <>
                      {['por_pedido', 'fija'].includes(editForm.tipoTarifa) && (
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Precio / Tarifa base</label>
                          <input type="number" step="0.01" value={editForm.precio} onChange={e => setEditForm({...editForm, precio: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        </div>
                      )}
                      
                      {['cargo_fijo_mas_variable', 'cargo_fijo_uf_mas_variable_uf'].includes(editForm.tipoTarifa) && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Cargo Fijo</label>
                            <input type="number" step="0.01" value={editForm.cargoFijo || 0} onChange={e => setEditForm({...editForm, cargoFijo: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Precio Variable por pedido</label>
                            <input type="number" step="0.01" value={editForm.cargoVariable || 0} onChange={e => setEditForm({...editForm, cargoVariable: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                          </div>
                        </>
                      )}

                      {editForm.moneda === 'UF' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Valor UF</label>
                          <input type="number" value={editForm.valorUf || 0} onChange={e => setEditForm({...editForm, valorUf: Number(e.target.value)})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        </div>
                      )}

                      <div className="flex items-center pt-6">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={editForm.aplicaIva} onChange={e => setEditForm({...editForm, aplicaIva: e.target.checked})} className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          <span className="ml-3 text-sm font-bold text-slate-700">Aplica IVA (19%)</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCancelEdit} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 flex items-center"><Check className="w-4 h-4 mr-2" /> Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;
fs.writeFileSync('src/pages/Projections.tsx', code);
