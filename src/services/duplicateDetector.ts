import { Order } from '../types';

export const isDuplicate = (order: Partial<Order>, existingOrders: Order[]): boolean => {
  return existingOrders.some(o => 
     o.clientId === order.clientId && 
     o.clientOrderId === order.clientOrderId && 
     o.deliveryDate === order.deliveryDate
  );
};

export const getDuplicate = (order: Partial<Order>, existingOrders: Order[]): Order | undefined => {
  return existingOrders.find(o => 
     o.clientId === order.clientId && 
     o.clientOrderId === order.clientOrderId && 
     o.deliveryDate === order.deliveryDate
  );
};
