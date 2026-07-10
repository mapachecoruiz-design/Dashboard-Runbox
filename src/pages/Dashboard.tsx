import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, CheckCircle, XCircle, RefreshCw, Map, Truck, DollarSign, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle, onClick }: any) => (
  <div 
    className={cn("bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4", onClick ? "cursor-pointer hover:border-indigo-300 transition-colors" : "")}
    onClick={onClick}
  >
    <div className={cn("p-2.5 rounded-lg shrink-0", colorClass)}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
      </div>
      {subtitle && <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export const Dashboard = () => {
  const { orders, routes, drivers, clients } = useAppContext();
  const [dateFilter, setDateFilter] = useState('today');
  const [showFailedModal, setShowFailedModal] = useState(false);

  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const displayOrders = dateFilter === 'today' ? todayOrders : orders;

  const delivered = displayOrders.filter(o => o.status === 'entregado').length;
  const failedOrdersList = displayOrders.filter(o => o.status === 'fallido' || o.status === 'reentrega');
  const failed = failedOrdersList.filter(o => o.status === 'fallido').length;
  const reattempts = failedOrdersList.filter(o => o.status === 'reentrega').length;
  const total = displayOrders.length;
  const effectiveness = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

  const estimatedRevenue = displayOrders.reduce((sum, o) => sum + o.chargedTariff, 0);
  const estimatedCost = displayOrders.reduce((sum, o) => sum + o.estimatedCost, 0);
  const estimatedMargin = estimatedRevenue - estimatedCost;

  const activeRoutes = routes.filter(r => r.status === 'en_curso').length;
  const activeDrivers = drivers.filter(d => d.isActive).length;

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#4f46e5'];
  const statusData = [
    { name: 'Entregado', value: delivered },
    { name: 'Fallido', value: failed },
    { name: 'Reentrega', value: reattempts },
    { name: 'Pendiente', value: total - delivered - failed - reattempts },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard Operacional</h1>
          <p className="text-xs text-slate-500 mt-1">Resumen general de la operación logística</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 px-3 py-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase">Período:</span>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none"
            >
              <option value="today">Hoy</option>
              <option value="month">Este Mes</option>
            </select>
          </div>
          <button className="bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-indigo-800 transition-colors shadow-sm">
            Exportar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Pedidos" 
          value={total} 
          icon={Package} 
          colorClass="bg-indigo-50 text-indigo-700" 
          subtitle="Total procesados"
        />
        <StatCard 
          title="Efectividad" 
          value={`${effectiveness}%`} 
          icon={Activity} 
          colorClass="bg-green-50 text-green-700" 
          subtitle={`${delivered} entregados`}
        />
        <StatCard 
          title="Fallidos / Reentregas" 
          value={`${failed} / ${reattempts}`} 
          icon={XCircle} 
          colorClass="bg-red-50 text-red-600" 
          subtitle="Atención requerida"
          onClick={() => setShowFailedModal(true)}
        />
        <div className="bg-indigo-900 p-4 rounded-xl text-white shadow-lg flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Margen Estimado</span>
            <DollarSign className="w-4 h-4 opacity-40" />
          </div>
          <div className="text-2xl font-bold">${estimatedMargin.toLocaleString('es-CL')}</div>
          <div className="mt-1 text-[10px] flex gap-2">
            <span className="text-indigo-200">Ingresos: ${estimatedRevenue.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Volumen por Comuna (Top 5)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Las Condes', pedidos: Math.floor(Math.random() * 50) + 10 },
                { name: 'Providencia', pedidos: Math.floor(Math.random() * 40) + 10 },
                { name: 'Santiago', pedidos: Math.floor(Math.random() * 60) + 10 },
                { name: 'Maipú', pedidos: Math.floor(Math.random() * 30) + 10 },
                { name: 'Colina', pedidos: Math.floor(Math.random() * 20) + 10 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
                <Bar dataKey="pedidos" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Estado de Pedidos</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-700 mr-4">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rutas Activas</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{activeRoutes}</span>
                </div>
              </div>
            </div>
            <button className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest hover:underline">Ver detalle</button>
         </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600 mr-4">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Choferes en Ruta</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{activeDrivers}</span>
                </div>
              </div>
            </div>
            <button className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest hover:underline">Ver detalle</button>
         </div>
      </div>

      {showFailedModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Listado de Fallidos / Reentregas</h2>
                <p className="text-sm text-slate-500 mt-1">Pedidos que no pudieron ser entregados con éxito en el período seleccionado.</p>
              </div>
              <button 
                onClick={() => setShowFailedModal(false)}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-600 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">ID Pedido</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Comuna</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {failedOrdersList.map((order) => {
                    const client = clients.find(c => c.id === order.clientId);
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{order.clientOrderId || order.id}</td>
                        <td className="px-6 py-4 text-slate-600">{client?.name || order.clientId}</td>
                        <td className="px-6 py-4 text-slate-600">{order.commune}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider",
                            order.status === 'fallido' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {order.failureReason || 'Sin especificar'}
                        </td>
                      </tr>
                    );
                  })}
                  {failedOrdersList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No hay pedidos fallidos o reentregas en el período seleccionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowFailedModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
