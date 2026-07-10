const fs = require('fs');
const file = 'src/pages/ConsolidadoMensual/TablaConsolidado.tsx';
let code = fs.readFileSync(file, 'utf8');

// Find all subclients across all agrupadores
const subclientsLogic = `  const agrupadores = data.filter(d => d.isAgrupador);
  const subclientIds = new Set(agrupadores.flatMap(a => a.subClients || []));`;

code = code.replace(
  `  const margenPorcentajeTotal = totals.ingresoSinIva > 0 ? totals.margenBruto / totals.ingresoSinIva : 0;`,
  `  const margenPorcentajeTotal = totals.ingresoSinIva > 0 ? totals.margenBruto / totals.ingresoSinIva : 0;\n${subclientsLogic}`
);

code = code.replace(
  `{data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{row.clientName}</div>
                    {row.isAgrupador && <div className="text-[9px] text-indigo-500 font-bold uppercase">Agrupador</div>}
                  </td>`,
  `{data.map((row) => {
                const isSubclient = subclientIds.has(row.clientId);
                return (
                <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", row.isAgrupador ? "bg-indigo-50/30" : "")}>
                  <td className="px-4 py-3">
                    <div className={cn("font-bold text-slate-900 flex items-center", isSubclient ? "ml-4 text-slate-600" : "")}>
                      {isSubclient && <span className="text-slate-300 mr-2">↳</span>}
                      {row.clientName}
                    </div>
                    {row.isAgrupador && <div className="text-[9px] text-indigo-500 font-bold uppercase mt-0.5">Agrupador</div>}
                  </td>`
);

code = code.replace(
  `                </tr>
              ))}
              {data.length === 0`,
  `                </tr>
              );
              })}
              {data.length === 0`
);

fs.writeFileSync(file, code);
