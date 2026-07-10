import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, RefreshCw, XCircle, ArrowRight, Save, History, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import { parseFile } from '../services/importService';
import { getSuggestedMapping, standardFieldsList, StandardField } from '../services/columnMapper';
import { addOrders, getOrders } from '../data/orders';
import { Order } from '../types';
import { useAppContext } from '../context/AppContext';
import { clients } from '../data/clients';
import { addImportHistory, getImportHistory, ImportHistoryItem } from '../data/imports';
import { normalizeStatus, normalizeDate, findClientId, isDuplicate } from '../services/orderNormalizer';

type ImportStep = 'select' | 'mapping' | 'preview' | 'result';

export const Imports = () => {
  const { setOrders } = useAppContext();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [history, setHistory] = useState<ImportHistoryItem[]>([]);
  
  const [step, setStep] = useState<ImportStep>('select');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [rawData, setRawData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  const [previewOrders, setPreviewOrders] = useState<{ order: Order, isError: boolean, errorMsg: string, isDuplicate: boolean }[]>([]);
  const [summary, setSummary] = useState({ total: 0, valid: 0, errors: 0, duplicates: 0 });

  React.useEffect(() => {
     if (activeTab === 'history') {
        setHistory(getImportHistory().reverse());
     }
  }, [activeTab, step]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setIsProcessing(true);
      try {
        const data = await parseFile(selected);
        if (data.length > 0) {
          const cols = Object.keys(data[0]);
          setColumns(cols);
          setRawData(data);
          setMapping(getSuggestedMapping(cols));
          setStep('mapping');
        } else {
          alert('El archivo está vacío');
        }
      } catch (err) {
        alert('Error al leer el archivo: ' + err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMappingChange = (fileCol: string, stdField: string) => {
    setMapping(prev => ({ ...prev, [fileCol]: stdField }));
  };

  const generatePreview = () => {
    setIsProcessing(true);
    
    // Reverse mapping for easy lookup: stdField -> fileCol
    const stdToFile: Record<string, string> = {};
    Object.entries(mapping).forEach(([fCol, stdF]) => {
      if (stdF) stdToFile[stdF] = fCol;
    });

    const existingOrders = getOrders();
    const generated: typeof previewOrders = [];
    let validCount = 0;
    let errCount = 0;
    let dupCount = 0;

    rawData.forEach((row, i) => {
      // Extract mapped fields
      const idPedidoCliente = stdToFile['clientOrderId'] ? row[stdToFile['clientOrderId']] : undefined;
      const clienteStr = stdToFile['cliente'] ? row[stdToFile['cliente']] : undefined;
      const fechaEntregaStr = stdToFile['deliveryDate'] ? row[stdToFile['deliveryDate']] : undefined;
      const comuna = stdToFile['commune'] ? row[stdToFile['commune']] : undefined;
      
      const isError = !idPedidoCliente || !clienteStr || !fechaEntregaStr || !comuna;
      let errorMsg = '';
      if (!idPedidoCliente) errorMsg += 'Falta ID Pedido. ';
      if (!clienteStr) errorMsg += 'Falta Cliente. ';
      if (!fechaEntregaStr) errorMsg += 'Falta Fecha. ';
      if (!comuna) errorMsg += 'Falta Comuna. ';

      const clientId = findClientId(clienteStr);
      const deliveryDate = normalizeDate(fechaEntregaStr);

      const order: Order = {
        id: 'IMP-' + Date.now() + '-' + i,
        clientOrderId: String(idPedidoCliente || ''),
        clientId,
        deliveryDate,
        createdAt: deliveryDate,
        pickupDate: deliveryDate,
        commune: String(comuna || ''),
        region: 'RM',
        address: stdToFile['address'] ? String(row[stdToFile['address']] || '') : '',
        status: normalizeStatus(stdToFile['status'] ? row[stdToFile['status']] : ''),
        serviceType: 'normal',
        driverId: stdToFile['chofer'] ? String(row[stdToFile['chofer']] || '') : null,
        routeId: stdToFile['ruta'] ? String(row[stdToFile['ruta']] || '') : null,
        packagesCount: stdToFile['packagesCount'] ? Number(row[stdToFile['packagesCount']]) || 1 : 1,
        weight: 1,
        chargedTariff: stdToFile['chargedTariff'] ? Number(row[stdToFile['chargedTariff']]) || 0 : 0,
        estimatedCost: stdToFile['estimatedCost'] ? Number(row[stdToFile['estimatedCost']]) || 0 : 0,
        estimatedMargin: 0
      };

      const isDup = isDuplicate(order, existingOrders);
      
      if (isError) errCount++;
      else if (isDup) dupCount++;
      else validCount++;

      generated.push({ order, isError, errorMsg, isDuplicate: isDup });
    });

    setPreviewOrders(generated);
    setSummary({ total: rawData.length, valid: validCount, errors: errCount, duplicates: dupCount });
    setStep('preview');
    setIsProcessing(false);
  };

  const confirmImport = () => {
    setIsProcessing(true);
    
    // Solo importamos los validos y no duplicados (por defecto, omitir duplicados)
    const validOrders = previewOrders.filter(p => !p.isError && !p.isDuplicate).map(p => p.order);
    
    const updated = addOrders(validOrders);
    setOrders(updated);
    
    addImportHistory({
      id: 'HIST-' + Date.now(),
      fileName: file?.name || 'desconocido',
      dataSource: 'General',
      date: new Date().toISOString(),
      user: 'Usuario Local',
      rowsRead: summary.total,
      rowsImported: validOrders.length,
      errorsCount: summary.errors,
      duplicatesCount: summary.duplicates,
      status: summary.errors > 0 ? 'procesado_con_errores' : 'procesado'
    });

    setStep('result');
    setIsProcessing(false);
  };

  const reset = () => {
    setStep('select');
    setFile(null);
    setRawData([]);
    setColumns([]);
    setMapping({});
    setPreviewOrders([]);
  };

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
          {step === 'select' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-20">
               <UploadCloud className="w-16 h-16 text-indigo-200 mb-4" />
               <h2 className="text-lg font-bold text-slate-700">Subir archivo de pedidos</h2>
               <p className="text-sm text-slate-500 mb-6 text-center max-w-md">Selecciona un archivo CSV o Excel (.xlsx, .xls) para cargar pedidos al sistema.</p>
               
               <label className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer hover:bg-indigo-700 transition-colors">
                  {isProcessing ? 'Procesando...' : 'Seleccionar Archivo'}
                  <input type="file" className="hidden" accept=".csv, .xls, .xlsx" onChange={handleFileChange} disabled={isProcessing} />
               </label>
            </div>
          )}

          {step === 'mapping' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold text-slate-800">Mapeo de Columnas</h2>
                 <button onClick={generatePreview} disabled={isProcessing} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center hover:bg-indigo-700 disabled:opacity-50">
                   {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                   Vista Previa
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {columns.map(col => (
                    <div key={col} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <span className="text-sm font-medium text-slate-700 truncate w-1/2">{col}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 mx-2 flex-shrink-0" />
                      <select 
                        value={mapping[col] || ''} 
                        onChange={(e) => handleMappingChange(col, e.target.value)}
                        className="w-1/2 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value="">-- Ignorar --</option>
                        {standardFieldsList.map(f => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
               <div className="grid grid-cols-4 gap-4">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-xs text-slate-500 font-bold uppercase">Total Filas</div>
                   <div className="text-2xl font-bold text-slate-800">{summary.total}</div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                   <div className="text-xs text-emerald-500 font-bold uppercase">Válidos</div>
                   <div className="text-2xl font-bold text-emerald-700">{summary.valid}</div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
                   <div className="text-xs text-rose-500 font-bold uppercase">Errores</div>
                   <div className="text-2xl font-bold text-rose-700">{summary.errors}</div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                   <div className="text-xs text-amber-500 font-bold uppercase">Duplicados</div>
                   <div className="text-2xl font-bold text-amber-700">{summary.duplicates}</div>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-lg font-bold text-slate-800">Vista Previa (primeros 20)</h2>
                   <div className="flex gap-2">
                     <button onClick={() => setStep('mapping')} className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Volver</button>
                     <button onClick={confirmImport} disabled={isProcessing || summary.valid === 0} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center hover:bg-emerald-700 disabled:opacity-50">
                       {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                       Confirmar e Importar ({summary.valid})
                     </button>
                   </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-3">Estado Fila</th>
                          <th className="p-3">ID Pedido Cliente</th>
                          <th className="p-3">Cliente</th>
                          <th className="p-3">Fecha</th>
                          <th className="p-3">Comuna</th>
                          <th className="p-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewOrders.slice(0, 20).map((p, i) => (
                          <tr key={i} className={cn(p.isError ? "bg-rose-50/50" : p.isDuplicate ? "bg-amber-50/50" : "")}>
                            <td className="p-3">
                               {p.isError ? <span className="flex items-center text-rose-600 text-xs font-bold"><XCircle className="w-3 h-3 mr-1"/> Error: {p.errorMsg}</span>
                                : p.isDuplicate ? <span className="flex items-center text-amber-600 text-xs font-bold"><AlertCircle className="w-3 h-3 mr-1"/> Duplicado</span>
                                : <span className="flex items-center text-emerald-600 text-xs font-bold"><CheckCircle className="w-3 h-3 mr-1"/> Válido</span>}
                            </td>
                            <td className="p-3 font-medium">{p.order.clientOrderId}</td>
                            <td className="p-3">{clients.find(c => c.id === p.order.clientId)?.name || p.order.clientId}</td>
                            <td className="p-3">{p.order.deliveryDate}</td>
                            <td className="p-3">{p.order.commune}</td>
                            <td className="p-3">
                               <span className="px-2 py-1 bg-slate-100 rounded text-xs capitalize">{p.order.status.replace('_', ' ')}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
            </div>
          )}

          {step === 'result' && (
            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
               <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
               <h2 className="text-xl font-bold text-slate-800">¡Importación Completada!</h2>
               <p className="text-slate-500 mt-2 text-center max-w-sm">
                 Se importaron correctamente {summary.valid} pedidos. Los datos ya están disponibles en los demás módulos.
               </p>
               <button onClick={reset} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                 Realizar nueva importación
               </button>
            </div>
          )}
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
