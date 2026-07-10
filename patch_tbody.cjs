const fs = require('fs');
const file = 'src/pages/Projections.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<tbody className="divide-y divide-slate-100">([\s\S]*?)<\/tbody>/;

const newTbody = `<tbody className="divide-y divide-slate-100">
                {calculated.map((row) => (
                  <tr key={row.id} className={cn("hover:bg-slate-50 transition-colors", row.tipoTarifa === 'agrupador' ? "bg-slate-50/50" : "")}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{row.name}</div>
                      {row.observaciones && <div className="text-[9px] text-slate-500 truncate max-w-[150px]">{row.observaciones}</div>}
                      {!row.valid && row.tipoTarifa !== 'agrupador' && (
                        <div className="text-[9px] text-red-500 font-bold flex items-center mt-0.5"><AlertCircle className="w-3 h-3 mr-1" /> Faltan días trabajados</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-500">
                      {row.calendarTypeStr || '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">{formatNumber(row.accumulated)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.tipoTarifa !== 'agrupador' ? (
                        <span className="font-medium text-slate-600">{row.diasTrabajados} <span className="text-slate-400">/</span> {row.diasMes}</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                       {row.manualAdjustment ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold uppercase">Sí</span> : <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">No</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">{row.tipoTarifa !== 'agrupador' && row.valid ? formatNumber(row.promDiario) : '-'}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-700 bg-indigo-50/30">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? formatNumber(row.proyectados) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {row.tipoTarifa === 'agrupador' ? (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase">Agrupador</span>
                      ) : (
                        <div>
                          <span className="font-medium text-slate-900">{row.moneda === 'CLP' ? '$' : ''}{row.precio} {row.moneda === 'UF' ? 'UF' : ''}</span>
                          <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{row.tipoTarifa.replace(/_/g, ' ')}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? \`$\${formatMoney(row.sinIva)}\` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-500">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? \`$\${formatMoney(row.iva)}\` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700 bg-emerald-50/30">
                      {(row.tipoTarifa !== 'agrupador' && row.valid) || row.tipoTarifa === 'agrupador' ? \`$\${formatMoney(row.conIva)}\` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEditClick(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>`;

code = code.replace(regex, newTbody);
fs.writeFileSync(file, code);
