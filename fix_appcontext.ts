import fs from 'fs';

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
content = content.replace(
  "import { Order, Client, Driver, Route, TariffRule } from '../types';",
  "import { Order, Client, Driver, Route } from '../types';\nimport { BaseTariff, initialTariffs } from '../data/tariffs';"
);
content = content.replace(
  "tariffs: TariffRule[];",
  "tariffs: BaseTariff[];"
);
content = content.replace(
  "setTariffs: (tariffs: TariffRule[]) => void;",
  "setTariffs: (tariffs: BaseTariff[]) => void;"
);
content = content.replace(
  "import { mockOrders, mockClients, mockDrivers, mockRoutes, mockTariffs } from '../data/mockData';",
  "import { mockOrders, mockClients, mockDrivers, mockRoutes } from '../data/mockData';"
);
content = content.replace(
  "const [tariffs, setTariffs] = useState<TariffRule[]>(() => loadFromStorage('runbox_tariffs', mockTariffs));",
  "const [tariffs, setTariffs] = useState<BaseTariff[]>(() => loadFromStorage('runbox_tariffs', initialTariffs));"
);
fs.writeFileSync('src/context/AppContext.tsx', content);
