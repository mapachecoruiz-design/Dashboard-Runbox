import fs from 'fs';

let content = fs.readFileSync('src/pages/ConsolidadoMensual/ConsolidadoMensual.tsx', 'utf8');
content = content.replace(
  "const { ufValue, orders, clients, user } = useAppContext();",
  "const { ufValue, orders, clients, user, tariffs } = useAppContext();"
);
content = content.replace(
  "return calculateMonthlyConsolidado(\n       selectedMonth,",
  "return calculateMonthlyConsolidado(\n       tariffs,\n       selectedMonth,"
);
content = content.replace(
  "selectedMonth, selectedYear, ufValue, orders, clients, costosGenerales,",
  "tariffs, selectedMonth, selectedYear, ufValue, orders, clients, costosGenerales,"
);
fs.writeFileSync('src/pages/ConsolidadoMensual/ConsolidadoMensual.tsx', content);
