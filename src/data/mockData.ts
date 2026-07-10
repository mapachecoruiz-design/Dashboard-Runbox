import { Client, Driver, Order, Route, TariffRule } from '../types';

export const mockClients: Client[] = [
  { id: 'C001', name: 'Booz', isActive: true, serviceType: ['normal', 'express'], slaCommitted: 95, mainTariff: 3500 },
  { id: 'C002', name: 'ED', isActive: true, serviceType: ['same_day', 'normal'], slaCommitted: 98, mainTariff: 3800 },
  { id: 'C003', name: 'Farmaloop', isActive: true, serviceType: ['same_day', 'express'], slaCommitted: 99, mainTariff: 4000 },
  { id: 'C004', name: 'Yapp', isActive: true, serviceType: ['same_day', 'normal'], slaCommitted: 97, mainTariff: 3200 },
];

export const mockDrivers: Driver[] = [
  { id: 'D001', name: 'Ángel', isActive: true, paymentType: 'fijo', tariffPerRoute: 65000, fixedSalary: 0, phone: '+56912345678' },
  { id: 'D002', name: 'Ariel', isActive: true, paymentType: 'fijo', tariffPerRoute: 0, fixedSalary: 750000, phone: '+56987654321' },
  { id: 'D003', name: 'Claudia', isActive: true, paymentType: 'mixto', tariffPerRoute: 15000, fixedSalary: 600000, phone: '+56911223344' },
  { id: 'D004', name: 'Sebastián', isActive: true, paymentType: 'fijo', tariffPerRoute: 0, fixedSalary: 1650000, phone: '+56944332211', notes: 'Por 26 días trabajados' },
  { id: 'D005', name: 'Chofer Externo 1', isActive: true, paymentType: 'variable', tariffPerRoute: 60000, fixedSalary: 0, variablePaymentRules: '+$1000 por cada pedido sobre 30', phone: '+56999887766' },
];

export const mockRoutes: Route[] = [
  { id: 'R-20231024-01', date: new Date().toISOString(), driverId: 'D001', clientId: 'C001', communes: ['Las Condes', 'Providencia', 'Vitacura'], ordersCount: 45, deliveredCount: 42, failedCount: 3, status: 'en_curso', cost: 65000, revenue: 157500, margin: 92500 },
  { id: 'R-20231024-02', date: new Date().toISOString(), driverId: 'D002', clientId: 'C002', communes: ['Santiago', 'Estación Central'], ordersCount: 38, deliveredCount: 38, failedCount: 0, status: 'finalizada', cost: 28846, revenue: 144400, margin: 115554 },
  { id: 'R-20231024-03', date: new Date().toISOString(), driverId: 'D005', communes: ['Maipú', 'Colina'], ordersCount: 50, deliveredCount: 45, failedCount: 5, status: 'en_curso', cost: 80000, revenue: 175000, margin: 95000 },
];

export const mockOrders: Order[] = Array.from({ length: 50 }).map((_, i) => {
  const statusOptions = ['pendiente', 'en_ruta', 'entregado', 'fallido', 'reentrega', 'devuelto'] as const;
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const isDelivered = status === 'entregado';
  const clientId = mockClients[Math.floor(Math.random() * mockClients.length)].id;
  const tariff = Math.floor(Math.random() * 2000) + 2500;
  const cost = tariff * 0.6;

  return {
    id: `RB-${10000 + i}`,
    clientId: clientId,
    clientOrderId: `EXT-${80000 + i}`,
    createdAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    pickupDate: new Date(Date.now() - Math.random() * 50000000).toISOString(),
    deliveryDate: isDelivered ? new Date().toISOString() : null,
    commune: ['Las Condes', 'Providencia', 'Santiago', 'Maipú', 'Colina', 'Vitacura', 'La Florida', 'Ñuñoa', 'Lo Barnechea', 'Estación Central'][Math.floor(Math.random() * 10)],
    region: 'Metropolitana',
    address: `Calle Falsa ${100 + i}, Depto ${Math.floor(Math.random() * 100)}`,
    status: status,
    serviceType: ['same_day', 'flex', 'normal', 'express', 'refrigerado'][Math.floor(Math.random() * 5)] as any,
    driverId: mockDrivers[Math.floor(Math.random() * mockDrivers.length)].id,
    routeId: mockRoutes[Math.floor(Math.random() * mockRoutes.length)].id,
    packagesCount: Math.floor(Math.random() * 3) + 1,
    weight: Math.floor(Math.random() * 10) + 1,
    chargedTariff: tariff,
    estimatedCost: cost,
    estimatedMargin: tariff - cost,
    failureReason: status === 'fallido' ? 'No contesta' : undefined,
  };
});

export const mockTariffs: TariffRule[] = [
  { id: 'T001', clientId: 'C001', serviceType: 'normal', basePrice: 90000, currency: 'CLP', description: 'Booz ruta normal' },
  { id: 'T002', clientId: 'C001', serviceType: 'normal', commune: 'Colina', basePrice: 100000, currency: 'CLP', description: 'Booz ruta Colina' },
  { id: 'T003', clientId: 'C001', serviceType: 'express', basePrice: 65000, currency: 'CLP', description: 'Booz ruta express' },
  { id: 'T004', clientId: 'C002', serviceType: 'same_day', basePrice: 0.095, currency: 'UF', extraPackagePrice: 0.01, description: 'ED entrega same day hasta 5 bultos' },
  { id: 'T005', clientId: 'C004', serviceType: 'flex', basePrice: 0.08, currency: 'UF', description: 'Mercado Flex productos pequeños' },
];
