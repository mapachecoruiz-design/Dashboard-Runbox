/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Imports } from './pages/Imports';
import { Clients } from './pages/Clients';
import { RoutesPage } from './pages/Routes';
import { Drivers } from './pages/Drivers';
import { Tariffs } from './pages/Tariffs';
import { KPI } from './pages/KPI';
import { Reports } from './pages/Reports';
import { Projections } from './pages/Projections';
import { DriverPayments } from './pages/DriverPayments';
import { Integrations } from './pages/Integrations';
import { ConsolidadoMensual } from './pages/ConsolidadoMensual/ConsolidadoMensual';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="imports" element={<Imports />} />
            <Route path="clients" element={<Clients />} />
            <Route path="routes" element={<RoutesPage />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="driver-payments" element={<DriverPayments />} />
            <Route path="tariffs" element={<Tariffs />} />
            <Route path="kpi" element={<KPI />} />
            <Route path="reports" element={<Reports />} />
            <Route path="projections" element={<Projections />} />
            <Route path="consolidado" element={<ConsolidadoMensual />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="*" element={<div className="text-center py-20 text-slate-500">Módulo en construcción</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
