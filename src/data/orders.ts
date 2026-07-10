import { Order } from '../types';

const STORAGE_KEY = 'runbox_orders';

export const getOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load orders from local storage", e);
    return [];
  }
};

export const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to local storage", e);
  }
};

export const addOrders = (newOrders: Order[]) => {
  const currentOrders = getOrders();
  const updatedOrders = [...currentOrders, ...newOrders];
  saveOrders(updatedOrders);
  return updatedOrders;
};
