import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Driver, Order, Route } from '../types';
import { BaseTariff, initialTariffs } from '../data/tariffs';
import { mockClients, mockDrivers, mockOrders, mockRoutes } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../lib/storage';

interface AppContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  routes: Route[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  tariffs: BaseTariff[];
  setTariffs: React.Dispatch<React.SetStateAction<BaseTariff[]>>;
  ufValue: number;
  setUfValue: React.Dispatch<React.SetStateAction<number>>;
  user: { name: string; email: string; role: string } | null;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('runbox_orders', mockOrders));
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage('runbox_clients', mockClients));
  const [drivers, setDrivers] = useState<Driver[]>(() => loadFromStorage('runbox_drivers', mockDrivers));
  const [routes, setRoutes] = useState<Route[]>(() => loadFromStorage('runbox_routes', mockRoutes));
  const [tariffs, setTariffs] = useState<BaseTariff[]>(() => loadFromStorage('runbox_tariffs', initialTariffs));
  const [ufValue, setUfValue] = useState<number>(37000);
  const [user] = useState({ name: 'Admin User', email: 'admin@runbox.cl', role: 'admin' });

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    saveToStorage('runbox_orders', orders);
  }, [orders]);

  useEffect(() => {
    saveToStorage('runbox_clients', clients);
  }, [clients]);

  useEffect(() => {
    saveToStorage('runbox_drivers', drivers);
  }, [drivers]);

  useEffect(() => {
    saveToStorage('runbox_routes', routes);
  }, [routes]);

  useEffect(() => {
    saveToStorage('runbox_tariffs', tariffs);
  }, [tariffs]);

  useEffect(() => {
    fetch('https://mindicador.cl/api/uf')
      .then(res => res.json())
      .then(data => {
        if (data && data.serie && data.serie.length > 0) {
          setUfValue(data.serie[0].valor);
        }
      })
      .catch(err => console.error("Error fetching UF", err));
  }, []);

  const resetData = () => {
    localStorage.removeItem('runbox_orders');
    localStorage.removeItem('runbox_clients');
    localStorage.removeItem('runbox_drivers');
    localStorage.removeItem('runbox_routes');
    localStorage.removeItem('runbox_tariffs');
    localStorage.removeItem('runbox_costos_generales');
    localStorage.removeItem('runbox_projection_adjustments');
    localStorage.removeItem('runbox_monthly_closures');
    
    setOrders(mockOrders);
    setClients(mockClients);
    setDrivers(mockDrivers);
    setRoutes(mockRoutes);
    setTariffs(initialTariffs);
  };

  return (
    <AppContext.Provider
      value={{
        orders, setOrders,
        clients, setClients,
        drivers, setDrivers,
        routes, setRoutes,
        tariffs, setTariffs,
        ufValue, setUfValue,
        user,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
