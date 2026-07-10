import { Order } from '../types';
import { loadFromStorage, saveToStorage } from '../lib/storage';

const STORAGE_KEY = 'runbox_orders';

export const getOrders = (): Order[] => {
  return loadFromStorage(STORAGE_KEY, []);
};

export const saveOrders = (orders: Order[]) => {
  saveToStorage(STORAGE_KEY, orders);
};

export const addOrders = (newOrders: Order[]) => {
  const currentOrders = getOrders();
  const updatedOrders = [...currentOrders, ...newOrders];
  saveOrders(updatedOrders);
  return updatedOrders;
};
