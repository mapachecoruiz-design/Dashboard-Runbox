import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { formatMoney, formatNumber } from '../../lib/utils';

export const ComparativoGraficos = ({ data }: { data: any[] }) => {
  // En un caso real, data tendría evolución de varios meses. 
  // Para mock, crearemos un dataset ficticio de evolución mes a mes.
  const chartData = [
    { name: 'Ene', ingresos: 45000000, costos: 30000000, pedidos: 8500 },
    { name: 'Feb', ingresos: 42000000, costos: 28000000, pedidos: 8100 },
    { name: 'Mar', ingresos: 48000000, costos: 32000000, pedidos: 9200 },
    { name: 'Abr', ingresos: 51000000, costos: 34000000, pedidos: 9800 },
    { name: 'May', ingresos: 55000000, costos: 35000000, pedidos: 10500 },
    { name: 'Jun', ingresos: 52000000, costos: 33000000, pedidos: 9900 },
    { name: 'Jul', ingresos: 58000000, costos: 36000000, pedidos: 11200 },
  ];

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
