import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  PieChart, 
  Package, 
  Upload, 
  Users, 
  Map, 
  Truck, 
  DollarSign, 
  BarChart2, 
  FileText, 
  TrendingUp, 
  Settings,
  Box
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/orders', icon: Package, label: 'Pedidos' },
  { to: '/imports', icon: Upload, label: 'Importaciones' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/routes', icon: Map, label: 'Rutas' },
  { to: '/drivers', icon: Truck, label: 'Choferes' },
  { to: '/driver-payments', icon: DollarSign, label: 'Pagos a Choferes' },
  { to: '/tariffs', icon: Box, label: 'Tarifas' }, // Changed icon to not conflict
  { to: '/kpi', icon: BarChart2, label: 'KPI' },
  { to: '/reports', icon: FileText, label: 'Informes' },
  { to: '/projections', icon: TrendingUp, label: 'Proyecciones' },
  { to: '/consolidado', icon: PieChart, label: 'Consolidado Mensual' },
  { to: '/integrations', icon: Settings, label: 'Integraciones API' },
  { to: '/settings', icon: Settings, label: 'Configuración' },
];

export const Sidebar = () => {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2 text-indigo-700">
          <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">RunBox</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
          Control Center
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 text-slate-500 text-xs font-bold">
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-700 truncate">Admin User</span>
            <span className="text-[10px] text-slate-500 truncate">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
