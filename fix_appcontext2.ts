import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
content = content.replace(
  "import { Client, Driver, Order, Route, TariffRule } from '../types';",
  "import { Client, Driver, Order, Route } from '../types';\nimport { BaseTariff, initialTariffs } from '../data/tariffs';"
);
content = content.replace(
  "import { mockClients, mockDrivers, mockOrders, mockRoutes, mockTariffs } from '../data/mockData';",
  "import { mockClients, mockDrivers, mockOrders, mockRoutes } from '../data/mockData';"
);
content = content.replace(
  "setTariffs: React.Dispatch<React.SetStateAction<TariffRule[]>>;",
  "setTariffs: React.Dispatch<React.SetStateAction<BaseTariff[]>>;"
);
content = content.replace(
  "setTariffs(mockTariffs);",
  "setTariffs(initialTariffs);"
);
fs.writeFileSync('src/context/AppContext.tsx', content);
