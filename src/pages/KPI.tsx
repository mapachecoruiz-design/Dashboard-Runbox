import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export const KPI = () => {
  const { orders } = useAppContext();
  const [period, setPeriod] = useState('month');

  // Mock data for trends
  const trendData = [
    { name: 'Lun', entregados: 120, fallidos: 10, reentregas: 5 },
    { name: 'Mar', entregados: 132, fallidos: 8, reentregas: 7 },
    { name: 'Mie', entregados: 101, fallidos: 15, reentregas: 3 },
    { name: 'Jue', entregados: 143, fallidos: 5, reentregas: 8 },
    { name: 'Vie', entregados: 150, fallidos: 12, reentregas: 10 },
    { name: 'Sab', entregados: 80, fallidos: 4, reentregas: 2 },
    { name: 'Dom', entregados: 40, fallidos: 2, reentregas: 0 },
  ];

  const financialData = [
    { name: 'Semana 1', ingresos: 1200000, costos: 750000 },
    { name: 'Semana 2', ingresos: 1350000, costos: 800000 },
    { name: 'Semana 3', ingresos: 1100000, costos: 680000 },
    { name: 'Semana 4', ingresos: 1500000, costos: 850000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">KPI</h1>
          <p className="text-xs text-slate-500 mt-1">Indicadores clave de rendimiento</p>
        </div>
        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-3 py-1.5 w-fit">
          <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase">Período:</span>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent text-xs font-medium focus:outline-none"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="year">Este Año</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Volumen de Entregas Diario</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 600, paddingTop: '10px'}} />
                <Bar dataKey="entregados" name="Entregados" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" barSize={32} />
                <Bar dataKey="reentregas" name="Reentregas" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" barSize={32} />
                <Bar dataKey="fallidos" name="Fallidos" fill="#ef4444" radius={[0, 0, 0, 0]} stackId="a" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Ingresos vs Costos (Estimado)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} 
                  formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 600, paddingTop: '10px'}} />
                <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                <Line type="monotone" dataKey="costos" name="Costos" stroke="#ef4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efectividad Primer Intento</span>
           <div className="text-3xl font-bold text-slate-900 mt-2">89.4%</div>
           <p className="text-[10px] text-green-600 mt-1 font-bold">↑ 2.1% vs mes anterior</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Margen Bruto Promedio</span>
           <div className="text-3xl font-bold text-indigo-700 mt-2">38.2%</div>
           <p className="text-[10px] text-slate-400 mt-1 font-medium">Estable</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Costo Promedio Pedido</span>
           <div className="text-3xl font-bold text-slate-900 mt-2">$2,450</div>
           <p className="text-[10px] text-green-600 mt-1 font-bold">↓ 5% vs mes anterior</p>
        </div>
      </div>
    </div>
  );
};
