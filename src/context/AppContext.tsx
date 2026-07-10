import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Driver, Order, Route, TariffRule } from '../types';
import { mockClients, mockDrivers, mockOrders, mockRoutes, mockTariffs } from '../data/mockData';

interface AppContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  routes: Route[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  tariffs: TariffRule[];
  setTariffs: React.Dispatch<React.SetStateAction<TariffRule[]>>;
  ufValue: number;
  setUfValue: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [tariffs, setTariffs] = useState<TariffRule[]>(mockTariffs);
  const [ufValue, setUfValue] = useState<number>(37000);

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

  return (
    <AppContext.Provider
      value={{
        orders, setOrders,
        clients, setClients,
        drivers, setDrivers,
        routes, setRoutes,
        tariffs, setTariffs,
        ufValue, setUfValue
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
