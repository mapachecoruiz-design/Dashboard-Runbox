const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import { calculateWorkingDays }')) {
  code = code.replace(
    `import { getMockAccumulatedOrders, initialProjectionsConfig, ClientProjectionConfig, TariffType } from '../data/mockProjections';`,
    `import { getMockAccumulatedOrders, initialProjectionsConfig, ClientProjectionConfig, TariffType } from '../data/mockProjections';\nimport { calculateWorkingDays } from '../utils/calendar';\nimport { useAppContext } from '../context/AppContext';`
  );
}

// Modify calculatedProjection
code = code.replace(
  `type CalculatedProjection = ClientProjectionConfig & {`,
  `type CalculatedProjection = ClientProjectionConfig & {\n  autoDiasMes?: number;\n  autoDiasTrabajados?: number;\n  calendarTypeStr?: string;`
);

const calcRegex = /const calculateProjection = \(config: ClientProjectionConfig, accumulated: number\): CalculatedProjection => \{([\s\S]*?)\};\n\nexport const Projections = \(\) => \{/;

const calcMatch = code.match(calcRegex);
if (calcMatch) {
  let newCalc = `const calculateProjection = (config: ClientProjectionConfig, accumulated: number, globalUf: number, currentDate: Date = new Date()): CalculatedProjection => {
  let diasTrabajados = config.diasTrabajados;
  let diasMes = config.diasMes;
  let autoDiasMes = diasMes;
  let autoDiasTrabajados = diasTrabajados;
  let calendarTypeStr = 'Normal';

  if (!config.manualAdjustment && config.calendarType) {
    const { autoDiasMes: adm, autoDiasTrabajados: adt } = calculateWorkingDays(currentDate.getFullYear(), currentDate.getMonth(), config, currentDate);
    diasMes = adm;
    diasTrabajados = adt;
    autoDiasMes = adm;
    autoDiasTrabajados = adt;
    calendarTypeStr = config.calendarType.replace('_', ' a ');
  } else if (config.manualAdjustment) {
     calendarTypeStr = 'Ajuste manual';
  }

  if (config.tipoTarifa === 'agrupador') {
    return { ...config, accumulated, valid: true, promDiario: 0, proyectados: 0, sinIva: 0, iva: 0, conIva: 0, autoDiasMes, autoDiasTrabajados, calendarTypeStr, diasTrabajados, diasMes };
  }
  if (!diasTrabajados || diasTrabajados <= 0) {
    return { ...config, accumulated, valid: false, promDiario: 0, proyectados: 0, sinIva: 0, iva: 0, conIva: 0, autoDiasMes, autoDiasTrabajados, calendarTypeStr, diasTrabajados, diasMes };
  }
  
  const promDiario = accumulated / diasTrabajados;
  const proyectados = promDiario * diasMes;
  let sinIva = 0;
  
  const ufToUse = globalUf;

  switch (config.tipoTarifa) {
    case 'por_pedido':
      if (config.moneda === 'CLP') {
        sinIva = proyectados * config.precio;
      } else {
        sinIva = proyectados * config.precio * ufToUse;
      }
      break;
    case 'fija':
      if (config.moneda === 'CLP') {
        sinIva = config.precio;
      } else {
        sinIva = config.precio * ufToUse;
      }
      break;
    case 'cargo_fijo_mas_variable':
      if (config.moneda === 'CLP') {
        sinIva = (config.cargoFijo || 0) + (proyectados * (config.cargoVariable || 0));
      } else {
        sinIva = ((config.cargoFijo || 0) + (proyectados * (config.cargoVariable || 0))) * ufToUse;
      }
      break;
    case 'cargo_fijo_uf_mas_variable_uf':
      // Support for special formula for El Reinal
      if (config.id === '20') {
         sinIva = ((config.cargoFijo || 0) + Math.max(0, proyectados - 30) * (config.cargoVariable || 0)) * ufToUse;
      } else {
         sinIva = ((config.cargoFijo || 0) + (proyectados * (config.cargoVariable || 0))) * ufToUse;
      }
      break;
  }
  
  const iva = config.aplicaIva ? sinIva * 0.19 : 0;
  const conIva = sinIva + iva;
  
  return {
    ...config,
    diasTrabajados,
    diasMes,
    accumulated,
    valid: true,
    promDiario,
    proyectados,
    sinIva,
    iva,
    conIva,
    autoDiasMes,
    autoDiasTrabajados,
    calendarTypeStr
  };
};

export const Projections = () => {`;
  code = code.replace(calcRegex, newCalc);
}

// Modify useMemo where calculated is computed
code = code.replace(
  /const calculated = useMemo\(\(\) => \{([\s\S]*?)\}, \[configs, accumulatedData\]\);/,
  `const { ufValue } = useAppContext();\n  const [currentDate, setCurrentDate] = useState(new Date());\n\n  const calculated = useMemo(() => {
    const normal = configs.filter(c => c.tipoTarifa !== 'agrupador').map(c => calculateProjection(c, accumulatedData[c.id] || 0, ufValue, currentDate));
    const grouped = configs.filter(c => c.tipoTarifa === 'agrupador').map(c => {
       const subs = normal.filter(n => c.subClients?.includes(n.id));
       const accumulated = subs.reduce((sum, s) => sum + s.accumulated, 0);
       const proyectados = subs.reduce((sum, s) => sum + s.proyectados, 0);
       const sinIva = subs.reduce((sum, s) => sum + s.sinIva, 0);
       const iva = subs.reduce((sum, s) => sum + s.iva, 0);
       const conIva = subs.reduce((sum, s) => sum + s.conIva, 0);
       const calInfo = calculateProjection(c, accumulated, ufValue, currentDate);
       return { ...c, accumulated, valid: true, promDiario: 0, proyectados, sinIva, iva, conIva, autoDiasMes: calInfo.autoDiasMes, autoDiasTrabajados: calInfo.autoDiasTrabajados, calendarTypeStr: calInfo.calendarTypeStr, diasTrabajados: calInfo.diasTrabajados, diasMes: calInfo.diasMes } as CalculatedProjection;
    });
    return configs.map(c => c.tipoTarifa === 'agrupador' ? grouped.find(g => g.id === c.id)! : normal.find(n => n.id === c.id)!);
  }, [configs, accumulatedData, ufValue, currentDate]);`
);

fs.writeFileSync(file, code);
