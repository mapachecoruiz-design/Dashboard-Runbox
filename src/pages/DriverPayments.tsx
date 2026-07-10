import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Truck, Search, Calendar, ChevronLeft, ChevronRight, DollarSign, Download, Filter } from 'lucide-react';

export const DriverPayments = () => {
  const { drivers, routes } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Date filtering logic
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Filter routes for the current month
  const monthRoutes = useMemo(() => {
    return routes.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [routes, currentMonth, currentYear]);

  // Calculate payments
  const payments = useMemo(() => {
    let result = drivers.map(driver => {
      const driverRoutes = monthRoutes.filter(r => r.driverId === driver.id);
      const routeCount = driverRoutes.length;
      
      const variablePay = routeCount * (driver.tariffPerRoute || 0);
      const fixedPay = driver.fixedSalary || 0;
      const totalPay = variablePay + fixedPay;

      return {
        driver,
        routeCount,
        variablePay,
        fixedPay,
        totalPay
      };
    });

    if (searchTerm) {
      result = result.filter(p => p.driver.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return result.sort((a, b) => b.totalPay - a.totalPay);
  }, [drivers, monthRoutes, searchTerm]);

  const totalExpectedPayments = payments.reduce((acc, curr) => acc + curr.totalPay, 0);
  const totalRoutesCompleted = payments.reduce((acc, curr) => acc + curr.routeCount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Liquidación de Choferes</h1>
          <p className="text-slate-500 mt-1">Sueldos esperados según rutas asignadas y tipo de pago.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
            <button 
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 font-medium text-sm text-slate-700 min-w-[120px] text-center">
              {capitalizedMonth} {currentYear}
            </div>
            <button 
              onClick={handleNextMonth}
              className="p-1 hover:bg-slate-100 rounded text-slate-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <DollarSign className="w-5 h-5" />
            <h3 className="font-semibold">Total a Pagar Estimado</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ${totalExpectedPayments.toLocaleString('es-CL')}
          </p>
          <p className="text-sm text-slate-500 mt-1">Para el periodo {capitalizedMonth} {currentYear}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Truck className="w-5 h-5" />
            <h3 className="font-semibold">Rutas del Periodo</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {totalRoutesCompleted}
          </p>
          <p className="text-sm text-slate-500 mt-1">Rutas realizadas por los choferes</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Choferes Activos</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {payments.filter(p => p.routeCount > 0 || p.fixedPay > 0).length}
          </p>
          <p className="text-sm text-slate-500 mt-1">Con rutas o sueldo fijo este mes</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Chofer</th>
                <th className="px-6 py-4 font-medium">Tipo Pago</th>
                <th className="px-6 py-4 font-medium text-right">Rutas</th>
                <th className="px-6 py-4 font-medium text-right">Tarifa x Ruta</th>
                <th className="px-6 py-4 font-medium text-right">Variable</th>
                <th className="px-6 py-4 font-medium text-right">Fijo</th>
                <th className="px-6 py-4 font-medium text-right text-indigo-700">Total Esperado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={payment.driver.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{payment.driver.name}</div>
                    {payment.driver.notes && (
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{payment.driver.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium capitalize
                      ${payment.driver.paymentType === 'fijo' ? 'bg-blue-50 text-blue-700' : 
                        payment.driver.paymentType === 'variable' ? 'bg-green-50 text-green-700' : 
                        'bg-purple-50 text-purple-700'}`}>
                      {payment.driver.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">
                    {payment.routeCount}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ${(payment.driver.tariffPerRoute || 0).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ${payment.variablePay.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ${payment.fixedPay.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-indigo-700">
                    ${payment.totalPay.toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron choferes para el criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
            {payments.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="px-6 py-4 font-medium text-slate-900">Total</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">{totalRoutesCompleted}</td>
                  <td colSpan={3}></td>
                  <td className="px-6 py-4 text-right font-bold text-indigo-700 text-base">
                    ${totalExpectedPayments.toLocaleString('es-CL')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
