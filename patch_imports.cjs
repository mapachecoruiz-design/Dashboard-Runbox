const fs = require('fs');
const file = 'src/pages/Imports.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { Order, addOrders, getOrders } from '../data/orders';
import { addImportHistory } from '../data/imports';`,
  `import { Order, addOrders, getOrders } from '../data/orders';
import { addImportHistory, getImportHistory, ImportHistoryItem } from '../data/imports';
import { History, Upload } from 'lucide-react';`
);

const newHeader = `
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [history, setHistory] = useState<ImportHistoryItem[]>([]);

  React.useEffect(() => {
     if (activeTab === 'history') {
        setHistory(getImportHistory().reverse());
     }
  }, [activeTab, step]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Importaciones</h1>
          <p className="text-xs text-slate-500 mt-1">Carga masiva de pedidos desde Excel o CSV</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('upload')} 
            className={cn("px-4 py-2 text-sm font-bold rounded-md flex items-center transition-colors", activeTab === 'upload' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Nueva Carga
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={cn("px-4 py-2 text-sm font-bold rounded-md flex items-center transition-colors", activeTab === 'history' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <History className="w-4 h-4 mr-2" />
            Historial
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <>
`;

code = code.replace(
  `return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Importaciones</h1>
        <p className="text-xs text-slate-500 mt-1">Carga masiva de pedidos desde Excel o CSV</p>
      </div>`,
  newHeader
);

const endTags = `
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Fecha</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs">Archivo</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-center">Filas</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-center text-emerald-600">Importados</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-center text-rose-600">Errores</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-center text-amber-600">Duplicados</th>
                <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                 <tr><td colSpan={7} className="p-8 text-center text-slate-400">No hay historial de importaciones</td></tr>
              ) : history.map(h => (
                 <tr key={h.id} className="hover:bg-slate-50">
                   <td className="p-3">{new Date(h.date).toLocaleString()}</td>
                   <td className="p-3 font-medium text-slate-700">{h.fileName}</td>
                   <td className="p-3 text-center">{h.rowsRead}</td>
                   <td className="p-3 text-center font-bold text-emerald-600">{h.rowsImported}</td>
                   <td className="p-3 text-center font-bold text-rose-600">{h.errorsCount}</td>
                   <td className="p-3 text-center font-bold text-amber-600">{h.duplicatesCount}</td>
                   <td className="p-3 text-right">
                      {h.status === 'procesado' ? <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Procesado</span> : <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">Con Errores</span>}
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
`;

code = code.replace(
  `      )}
    </div>
  );
};`,
  endTags
);

fs.writeFileSync(file, code);
