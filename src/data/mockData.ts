import { Client, Driver, Order, Route, TariffRule } from '../types';
import { clients as realClients } from './clients';

// Map simplified clients to full Client objects
export const mockClients: Client[] = realClients.map(c => ({
  id: c.id,
  name: c.name,
  isActive: true,
  serviceType: ['normal', 'express'], // default
  slaCommitted: 95,
  mainTariff: 3500,
  isAgrupador: c.isAgrupador,
  subClients: c.subClients as string[] | undefined,
  createdAt: new Date().toISOString(),
  status: 'active'
}));

export const mockDrivers: Driver[] = [
  { id: 'D001', name: 'Ángel', isActive: true, paymentType: 'fijo', tariffPerRoute: 65000, fixedSalary: 0, phone: '+56912345678' },
  { id: 'D002', name: 'Ariel', isActive: true, paymentType: 'fijo', tariffPerRoute: 0, fixedSalary: 750000, phone: '+56987654321' },
  { id: 'D003', name: 'Claudia', isActive: true, paymentType: 'mixto', tariffPerRoute: 15000, fixedSalary: 600000, phone: '+56911223344' },
  { id: 'D004', name: 'Sebastián', isActive: true, paymentType: 'fijo', tariffPerRoute: 0, fixedSalary: 1650000, phone: '+56944332211', notes: 'Por 26 días trabajados' },
  { id: 'D005', name: 'Chofer Externo 1', isActive: true, paymentType: 'variable', tariffPerRoute: 60000, fixedSalary: 0, variablePaymentRules: '+$1000 por cada pedido sobre 30', phone: '+56999887766' },
];

export const mockRoutes: Route[] = [
  { id: 'R-20231024-01', date: new Date().toISOString(), driverId: 'D001', clientId: 'booz', communes: ['Las Condes', 'Providencia', 'Vitacura'], ordersCount: 45, deliveredCount: 42, failedCount: 3, status: 'en_curso', cost: 65000, revenue: 157500, margin: 92500 },
];

export const mockOrders: Order[] = Array.from({ length: 500 }).map((_, i) => {
  const statusOptions = ['pendiente', 'en_ruta', 'entregado', 'fallido', 'reentrega', 'devuelto'] as const;
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const isDelivered = status === 'entregado';
  
  // Exclude agrupadores from order generation directly
  const availableClients = mockClients.filter(c => !c.isAgrupador);
  const clientId = availableClients[Math.floor(Math.random() * availableClients.length)].id;
  
  const tariff = Math.floor(Math.random() * 2000) + 2500;
  const cost = tariff * 0.6;
  
  // Random date within the current year and current or previous month
  const today = new Date();
  const m = Math.random() > 0.5 ? today.getMonth() : today.getMonth() - 1;
  const y = today.getFullYear();
  const d = Math.floor(Math.random() * 28) + 1;
  const dateObj = new Date(y, m, d);
  const dateStr = dateObj.toISOString().split('T')[0];

  return {
    id: `ORD-${202310000 + i}`,
    clientId: clientId,
    clientOrderId: `CLI-${1000 + i}`,
    createdAt: dateStr,
    pickupDate: dateStr,
    deliveryDate: isDelivered ? dateStr : null,
    commune: ['Las Condes', 'Providencia', 'Ñuñoa', 'Santiago', 'Macul'][Math.floor(Math.random() * 5)],
    region: 'RM',
    address: 'Av. Siempre Viva 123',
    status: status,
    serviceType: 'normal',
    driverId: Math.random() > 0.5 ? mockDrivers[Math.floor(Math.random() * mockDrivers.length)].id : null,
    routeId: null,
    packagesCount: Math.floor(Math.random() * 3) + 1,
    weight: Math.random() * 10,
    chargedTariff: tariff,
    estimatedCost: cost,
    estimatedMargin: tariff - cost,
  };
});

export const mockTariffs: TariffRule[] = [];
