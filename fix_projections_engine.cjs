const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

// Ensure import
if (!code.includes("calculateClientRevenue")) {
  code = code.replace(
    "import { cn } from '../lib/utils';",
    "import { cn } from '../lib/utils';\nimport { calculateClientRevenue } from '../services/tariffEngine';"
  );
}

// Rewrite calculateProjection
const newCalculateProjection = `const calculateProjection = (config: ClientProjectionConfig, accumulated: number, globalUf: number, currentDate: Date = new Date()): CalculatedProjection => {
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

  const revenueResult = calculateClientRevenue(config as any, {
    pedidos: proyectados,
    diasTrabajados,
    valorUf: globalUf,
  });

  return {
    ...config,
    accumulated,
    valid: true,
    promDiario,
    proyectados,
    sinIva: revenueResult.ingresoSinIva,
    iva: revenueResult.iva,
    conIva: revenueResult.ingresoConIva,
    autoDiasMes,
    autoDiasTrabajados,
    calendarTypeStr,
    diasTrabajados,
    diasMes
  };
};`;

code = code.replace(/const calculateProjection = \([\s\S]*?return \{[\s\S]*?conIva[\s\S]*?\};\n\};/, newCalculateProjection);

fs.writeFileSync(file, code);
