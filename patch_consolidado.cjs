const fs = require('fs');
const file = 'src/pages/ConsolidadoMensual/ConsolidadoMensual.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { mockConsolidado } from './mockData';`,
  `import { getConsolidadoData } from './mockData';\nimport { useAppContext } from '../../context/AppContext';`
);

code = code.replace(
  `const [selectedMonth, setSelectedMonth] = useState(7);`,
  `const { globalUf } = useAppContext();\n  const [selectedMonth, setSelectedMonth] = useState(7);`
);

code = code.replace(
  `  const dataMes = useMemo(() => {
    return mockConsolidado.filter(d => d.mes === selectedMonth && d.year === selectedYear);
  }, [selectedMonth, selectedYear]);`,
  `  const dataMes = useMemo(() => {
    return getConsolidadoData(selectedMonth, selectedYear, globalUf);
  }, [selectedMonth, selectedYear, globalUf]);`
);

code = code.replace(/mockConsolidado/g, 'dataMes');

fs.writeFileSync(file, code);
