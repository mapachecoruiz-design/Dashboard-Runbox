const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

// Ensure import for getOrders
if (!code.includes("import { getOrders }")) {
  code = code.replace(
    "import { useAppContext } from '../context/AppContext';",
    "import { useAppContext } from '../context/AppContext';\nimport { getOrders } from '../data/orders';"
  );
}

// Replace mock generation with real calculation
code = code.replace(
  `const { globalUf } = useAppContext();`,
  `const { globalUf } = useAppContext();\n  const allOrders = getOrders();`
);

code = code.replace(
  `const calculatedProjections: CalculatedProjection[] = useMemo(() => {
    return configs.map(config => {
      // In a real scenario, this would come from the database
      const accumulated = getMockAccumulatedOrders(config.id);
      return calculateProjection(config, accumulated, globalUf, currentDate);
    });
  }, [configs, globalUf]);`,
  `const calculatedProjections: CalculatedProjection[] = useMemo(() => {
    return configs.map(config => {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const clientOrders = allOrders.filter(o => {
         const d = new Date(o.fechaEntrega);
         // Support both string IDs and actual ClientIds
         // Here config.id might be 'booz_ruta_normal' or something, so we must check o.clientId
         return o.clientId === config.id && d.getMonth() + 1 === month && d.getFullYear() === year;
      });
      
      // If none, fallback to some logic or 0
      let accumulated = clientOrders.length;
      if (accumulated === 0 && config.tipoTarifa !== 'agrupador') {
          // Si no hay ordenes importadas todavia, para q la demo no se rompa visualmente, 
          // usaremos el mock solo como fallback visual hasta que carguen algo.
          accumulated = getMockAccumulatedOrders(config.id);
      }
      
      return calculateProjection(config, accumulated, globalUf, currentDate);
    });
  }, [configs, globalUf, allOrders]);`
);

fs.writeFileSync(file, code);
