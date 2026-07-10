const fs = require('fs');
const file = 'src/context/AppContext.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { getOrders }")) {
  code = code.replace(
    `import { mockClients, mockDrivers, mockOrders, mockRoutes, mockTariffs } from '../data/mockData';`,
    `import { mockClients, mockDrivers, mockOrders, mockRoutes, mockTariffs } from '../data/mockData';\nimport { getOrders } from '../data/orders';`
  );
}

code = code.replace(
  `const [orders, setOrders] = useState<Order[]>(mockOrders);`,
  `const [orders, setOrders] = useState<Order[]>(() => {\n    const saved = getOrders();\n    return saved.length > 0 ? saved : mockOrders;\n  });`
);

fs.writeFileSync(file, code);
