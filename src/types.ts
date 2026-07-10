export type OrderStatus = 'pendiente' | 'en_ruta' | 'entregado' | 'fallido' | 'reentrega' | 'devuelto';
export type ServiceType = 'same_day' | 'flex' | 'normal' | 'express' | 'refrigerado';

export interface Order {
  id: string; // ID interno RunBox
  clientId: string;
  clientOrderId: string; // ID pedido cliente
  createdAt: string; // Fecha de ingreso
  pickupDate: string | null; // Fecha de retiro
  deliveryDate: string | null; // Fecha de entrega
  commune: string;
  region: string;
  address: string;
  status: OrderStatus;
  serviceType: ServiceType;
  driverId: string | null;
  routeId: string | null;
  packagesCount: number; // Cantidad de bultos
  weight: number; // Peso
  chargedTariff: number; // Tarifa cobrada
  estimatedCost: number; // Costo estimado
  estimatedMargin: number; // Margen estimado
  failureReason?: string;
  notes?: string;
  podLink?: string; // Evidencia de entrega
}

export interface Client {
  id: string;
  name: string;
  rut?: string;
  operationalContact?: string;
  billingContact?: string;
  email?: string;
  phone?: string;
  serviceType: ServiceType[];
  slaCommitted: number; // %
  mainTariff: number;
  specialRules?: string;
  isActive: boolean;
}

export interface Driver {
  id: string;
  name: string;
  isActive: boolean;
  paymentType: 'fijo' | 'variable' | 'mixto';
  tariffPerRoute: number;
  fixedSalary: number;
  variablePaymentRules?: string;
  phone?: string;
  notes?: string;
}

export interface Route {
  id: string;
  date: string;
  driverId: string;
  clientId?: string; // Optional if multi-client
  communes: string[];
  ordersCount: number;
  deliveredCount: number;
  failedCount: number;
  status: 'creada' | 'en_curso' | 'finalizada';
  cost: number;
  revenue: number;
  margin: number;
  notes?: string;
}

export interface TariffRule {
  id: string;
  clientId: string;
  serviceType: ServiceType;
  commune?: string;
  region?: string;
  basePrice: number;
  currency: 'CLP' | 'UF';
  extraPackagePrice?: number;
  reattemptPrice?: number;
  returnPrice?: number;
  description: string;
}
