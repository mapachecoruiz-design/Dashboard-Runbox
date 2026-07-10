const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

const tableHeadersOld = `<thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Acum.</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">D.Trab/D.Mes</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Prom.</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-indigo-700">Proyectados</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Tarifa / Tipo</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-emerald-700">Monto Sin IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>`;

const tableHeadersNew = `<thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Cliente / Obs</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Calendario</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Acum.</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Días</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center text-[10px]">Ajuste<br/>Manual</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Prom.</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-indigo-700">Proyectados</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Tarifa aplicada</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-emerald-700">Sin IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right text-emerald-900">Con IVA</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>`;

code = code.replace(tableHeadersOld, tableHeadersNew);

fs.writeFileSync(file, code);
