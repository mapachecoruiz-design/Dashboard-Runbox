import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { formatMoney, formatNumber } from '../../lib/utils';

export const ComparativoGraficos = ({ data }: { data: any[] }) => {
  // Calculamos totales reales del mes actual
  const currentTotals = data.filter(r => !r.isAgrupador).reduce((acc, row) => ({
    ingresos: acc.ingresos + row.ingresoSinIva,
    costos: acc.costos + row.costoMensual,
    pedidos: acc.pedidos + row.pedidosMes,
  }), { ingresos: 0, costos: 0, pedidos: 0 });

  let chartData: any[] = [];
  
  if (currentTotals.pedidos > 0 || currentTotals.ingresos > 0) {
     chartData = [
       { name: 'Mes Actual', ingresos: currentTotals.ingresos, costos: currentTotals.costos, pedidos: currentTotals.pedidos }
     ];
  } else {
     return (
       <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 font-medium">
         No hay datos suficientes para comparar meses.
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ingresos vs Costos */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Evolución de Ingresos y Costos</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: number) => [`$${formatMoney(value)}`, '']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costos" name="Costos" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolución de Pedidos */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Evolución de Pedidos Totales</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [formatNumber(value), 'Pedidos']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="pedidos" name="Pedidos" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};
