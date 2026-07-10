import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Package, AlertCircle, Edit2, Check, X, FileSpreadsheet, LayoutDashboard, List, History } from 'lucide-react';
import { initialProjectionsConfig, ClientProjectionConfig, getMockAccumulatedOrders, TariffType } from '../data/mockProjections';
import { cn } from '../lib/utils';
import { calculateWorkingDays } from '../utils/calendar';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const calculateProjection = (config: ClientProjectionConfig, accumulated: number, globalUf: number, currentDate: Date = new Date()): CalculatedProjection => {
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
    calendarTypeStr = config.calendarType.replace('_', ' a ');
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
  let sinIva = 0;
  
  const ufToUse = globalUf;

  switch (config.tipoTarifa) {
    case 'por_pedido':
      if (config.moneda === 'CLP') {
        sinIva = proyectados * config.precio;
      } else {
        sinIva = proyectados * config.precio * ufToUse;
      }
      break;
    case 'fija':
      if (config.moneda === 'CLP') {
        sinIva = config.precio;
      } else {
        sinIva = config.precio * ufToUse;
      }
      break;
    case 'cargo_fijo_mas_variable':
      if (config.moneda === 'CLP') {
        sinIva = (config.cargoFijo || 0) + (proyectados * (config.cargoVariable || 0));
      } else {
        sinIva = ((config.cargoFijo || 0) + (proyectados * (config.cargoVariable || 0))) * ufToUse;
      }
      break;
    case 'cargo_fijo_uf_mas_variable_uf':
      // Support for special formula for El Reinal
      if (config.id === '20') {
         sinIva = ((config.cargoFijo || 0) + Math.max(0, proyectados - 30) * (config.cargoVariable || 0)) * ufToUse;
      } else {
         sinIva = ((config.cargoFijo || 0) + (proyectados * (config.cargoVariable || 0))) * ufToUse;
      }
      break;
  }
  
  const iva = config.aplicaIva ? sinIva * 0.19 : 0;
  const conIva = sinIva + iva;
  
  return {
    ...config,
    diasTrabajados,
    diasMes,
    accumulated,
    valid: true,
    promDiario,
    proyectados,
    sinIva,
    iva,
    conIva,
    autoDiasMes,
    autoDiasTrabajados,
    calendarTypeStr
  };
};

export const Projections = () => {
  const [configs, setConfigs] = useState<ClientProjectionConfig[]>(initialProjectionsConfig);
  const [activeTab, setActiveTab] = useState<'tabla' | 'tarjetas' | 'resumen' | 'comparativa' | 'historico'>('tabla');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ClientProjectionConfig | null>(null);

  const accumulatedData = useMemo(() => {
    const data: Record<string, number> = {};
    configs.forEach(c => {
      data[c.id] = getMockAccumulatedOrders(c.id);
    });
    return data;
  }, [configs]); // Normally this would come from a context/api

  const { ufValue } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const calculated = useMemo(() => {
    const normal = configs.filter(c => c.tipoTarifa !== 'agrupador').map(c => calculateProjection(c, accumulatedData[c.id] || 0, ufValue, currentDate));
    const grouped = configs.filter(c => c.tipoTarifa === 'agrupador').map(c => {
       const subs = normal.filter(n => c.subClients?.includes(n.id));
       const accumulated = subs.reduce((sum, s) => sum + s.accumulated, 0);
       const proyectados = subs.reduce((sum, s) => sum + s.proyectados, 0);
       const sinIva = subs.reduce((sum, s) => sum + s.sinIva, 0);
       const iva = subs.reduce((sum, s) => sum + s.iva, 0);
       const conIva = subs.reduce((sum, s) => sum + s.conIva, 0);
       const calInfo = calculateProjection(c, accumulated, ufValue, currentDate);
       return { ...c, accumulated, valid: true, promDiario: 0, proyectados, sinIva, iva, conIva, autoDiasMes: calInfo.autoDiasMes, autoDiasTrabajados: calInfo.autoDiasTrabajados, calendarTypeStr: calInfo.calendarTypeStr, diasTrabajados: calInfo.diasTrabajados, diasMes: calInfo.diasMes } as CalculatedProjection;
    });
    return configs.map(c => c.tipoTarifa === 'agrupador' ? grouped.find(g => g.id === c.id)! : normal.find(n => n.id === c.id)!);
  }, [configs, accumulatedData, ufValue, currentDate]);

  const totals = useMemo(() => {
    return calculated.reduce((acc, curr) => {
      if (curr.tipoTarifa === 'agrupador') return acc;
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
    setConfigs(prev => prev.map(c => c.id === editForm.id ? editForm : c));
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
            onClick={() => setActiveTab('comparativa')}
            className={cn("px-4 py-2 rounded-md text-xs font-bold transition-colors", activeTab === 'comparativa' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            2. Tabla comparativa
          </button>
          <button 
            onClick={() => setActiveTab('tarjetas')}
            className={cn("px-4 py-2 rounded-md text-xs font-bold transition-colors", activeTab === 'tarjetas' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            3. Tarjetas por cliente
          </button>
          <button 
            onClick={() => setActiveTab('resumen')}
            className={cn("px-4 py-2 rounded-md text-xs font-bold transition-colors", activeTab === 'resumen' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            4. Resumen general
          </button>
          <button 
            onClick={() => setActiveTab('historico')}
            className={cn("px-4 py-2 rounded-md text-xs font-bold transition-colors", activeTab === 'historico' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            5. Histórico
          </button>
        </div>
      </div>

      {activeTab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center text-slate-400 mb-2">
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
            <div className="bg-slate-900 p-4 rounded-xl shadow-sm text-white">
              <div className="flex items-center text-slate-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">Top Clientes</span>
              </div>
              <div className="mt-2 space-y-2">
                <div>
                  <div className="text-[10px] text-slate-400">Mayor Monto</div>
                  <div className="text-sm font-bold truncate">{topMonto?.name || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Mayor Volumen</div>
                  <div className="text-sm font-bold truncate">{topVolumen?.name || '-'}</div>
                </div>
              </div>
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
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} formatter={(val: number) => `$${formatMoney(val)}`} />
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
                    <Bar dataKey="pedidos" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tabla' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Cliente / Obs</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Calendario</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Acum.</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Días</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center text-[10px]">Ajuste<br/>Manual</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Prom.</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-indigo-700">Proyectados</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Tarifa aplicada</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-emerald-700">Sin IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-emerald-900">Con IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculated.map((row) => (
                  <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", row.tipoTarifa === 'agrupador' ? "bg-slate-50/50" : "")}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{row.name}</div>
                      {row.observaciones && <div className="text-[9px] text-slate-500 truncate max-w-[150px]">{row.observaciones}</div>}
                      {!row.valid && row.tipoTarifa !== 'agrupador' && (
                        <div className="text-[9px] text-red-500 font-bold flex items-center mt-0.5"><AlertCircle className="w-3 h-3 mr-1" /> Faltan días trabajados</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {row.calendarTypeStr || '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">{formatNumber(row.accumulated)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.tipoTarifa !== 'agrupador' ? (
                        <span className="font-medium text-slate-600">{row.diasTrabajados} <span className="text-slate-400">/</span> {row.diasMes}</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                       {row.manualAdjustment ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold uppercase">Sí</span> : <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">No</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">{row.tipoTarifa !== 'agrupador' && row.valid ? formatNumber(row.promDiario) : '-'}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-700 bg-indigo-50/30">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? formatNumber(row.proyectados) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {row.tipoTarifa === 'agrupador' ? (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase">Agrupador</span>
                      ) : (
                        <div>
                          <span className="font-medium text-slate-900">{row.moneda === 'CLP' ? '$' : ''}{row.precio} {row.moneda === 'UF' ? 'UF' : ''}</span>
                          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{row.tipoTarifa.replace(/_/g, ' ')}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? '$' + formatMoney(row.sinIva) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-500">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? '$' + formatMoney(row.iva) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700 bg-emerald-50/30">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? '$' + formatMoney(row.conIva) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEditClick(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tarjetas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {calculated.map(row => (
            <div key={row.id} className={cn("bg-white border rounded-xl p-4 shadow-sm relative", row.tipoTarifa === 'agrupador' ? "border-dashed border-slate-300 opacity-60" : "border-slate-200")}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 line-clamp-1">{row.name}</h3>
                  {row.tipoTarifa === 'agrupador' ? (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">Agrupador</span>
                  ) : (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold uppercase">{row.tipoTarifa.replace(/_/g, ' ')}</span>
                  )}
                </div>
                <button onClick={() => handleEditClick(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors bg-slate-50">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {row.tipoTarifa !== 'agrupador' ? (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Acumulados</div>
                      <div className="font-bold text-slate-800">{formatNumber(row.accumulated)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Días (Trab/Mes)</div>
                      <div className="font-bold text-slate-800">{row.diasTrabajados}/{row.diasMes}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Prom. Diario</div>
                      <div className="font-bold text-slate-800">{row.valid ? formatNumber(row.promDiario) : '-'}</div>
                    </div>
                  </div>

                  {!row.valid ? (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Ingrese días trabajados válidos para calcular la proyección.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pedidos Proyectados</div>
                        <div className="text-xl font-bold text-indigo-700">{formatNumber(row.proyectados)}</div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monto Proyectado</div>
                        <div className="text-xl font-bold text-emerald-700">${formatMoney(row.sinIva)}</div>
                      </div>
                      <div className="text-[10px] text-right text-slate-400 font-medium">
                        + IVA: ${formatMoney(row.iva)} = ${formatMoney(row.conIva)}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 mb-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Acumulados</div>
                      <div className="font-bold text-slate-800">{formatNumber(row.accumulated)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Sub-clientes</div>
                      <div className="font-bold text-slate-800">{row.subClients?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Prom. Diario</div>
                      <div className="font-bold text-slate-800">-</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pedidos Proyectados</div>
                      <div className="text-xl font-bold text-indigo-700">{formatNumber(row.proyectados)}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monto Proyectado</div>
                      <div className="text-xl font-bold text-emerald-700">${formatMoney(row.sinIva)}</div>
                    </div>
                    <div className="text-[10px] text-right text-slate-400 font-medium">
                      + IVA: ${formatMoney(row.iva)} = ${formatMoney(row.conIva)}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comparativa' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center text-slate-500">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700 mb-2">Tabla Comparativa</h2>
          <p className="max-w-md mx-auto text-sm">Vista comparativa entre proyecciones. Módulo en desarrollo.</p>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center text-slate-500">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-700 mb-2">Histórico de Proyecciones</h2>
          <p className="max-w-md mx-auto text-sm">Registro histórico de cierres de mes y desviaciones vs lo real. Módulo en desarrollo.</p>
        </div>
      )}

      {editingId && editForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Editar Proyección: {editForm.name}</h2>
              <button onClick={handleCancelEdit} className="p-1 text-slate-400 hover:bg-slate-200 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Días Trabajados hasta hoy</label>
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
                    <select value={editForm.tipoTarifa} onChange={e => setEditForm({...editForm, tipoTarifa: e.target.value as TariffType})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option value="por_pedido">Precio por pedido</option>
                      <option value="fija">Tarifa fija</option>
                      <option value="cargo_fijo_mas_variable">Cargo Fijo + Variable</option>
                      <option value="cargo_fijo_uf_mas_variable_uf">Cargo Fijo UF + Variable UF</option>
                      <option value="agrupador">Agrupador (Sin cálculo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Moneda</label>
                    <select value={editForm.moneda} onChange={e => setEditForm({...editForm, moneda: e.target.value as 'CLP' | 'UF'})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
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

              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Observaciones</label>
                <textarea 
                  value={editForm.observaciones || ''} 
                  onChange={e => setEditForm({...editForm, observaciones: e.target.value})} 
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Notas internas..."
                />
              </div>
              
              {editForm.tipoTarifa !== 'agrupador' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
                  <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase">Vista Previa de Cálculo</h4>
                  {(() => {
                    const preview = calculateProjection(editForm, accumulatedData[editForm.id] || 0, ufValue, currentDate);
                    if (!preview.valid) {
                      return <div className="text-xs text-red-500 font-bold">Faltan días trabajados válidos.</div>;
                    }
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-[10px] text-slate-500">Proyectados</div>
                          <div className="font-bold">{formatNumber(preview.proyectados)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Monto Sin IVA</div>
                          <div className="font-bold text-emerald-600">${formatMoney(preview.sinIva)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">IVA</div>
                          <div className="font-bold">${formatMoney(preview.iva)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">Monto Con IVA</div>
                          <div className="font-bold text-indigo-700">${formatMoney(preview.conIva)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={handleCancelEdit} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">Cancelar</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 flex items-center"><Check className="w-4 h-4 mr-2" /> Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
