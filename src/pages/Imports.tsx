import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const Imports = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Mock upload
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      alert('Archivo procesado con éxito (Mock)');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Importaciones</h1>
        <p className="text-xs text-slate-500 mt-1">Carga masiva de pedidos desde Excel o CSV</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Nueva Importación</h2>
            
            <div className="mb-6 flex space-x-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Origen de Datos</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Booz (Excel Estandar)</option>
                  <option>TrackPod (CSV Export)</option>
                  <option>Plantilla RunBox (CSV)</option>
                  <option>Otro Cliente...</option>
                </select>
              </div>
            </div>

            <div 
              className={cn(
                "border-2 border-dashed rounded-xl p-10 text-center transition-colors",
                isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-slate-50",
                file ? "bg-slate-50 border-slate-200" : "hover:bg-slate-100 hover:border-slate-300"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <UploadCloud className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Haz clic para subir o arrastra un archivo</h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-4">Solo archivos .xls, .xlsx o .csv hasta 10MB</p>
                  <label className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                    Seleccionar Archivo
                    <input type="file" className="hidden" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
                  </label>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <File className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{file.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setFile(null)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                      disabled={isUploading}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-4 py-2 bg-indigo-700 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-colors shadow-sm disabled:opacity-70 flex items-center"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        'Iniciar Importación'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Historial Reciente</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { file: 'pedidos_booz_oct.xlsx', date: 'Hoy, 08:30', status: 'success', rows: 145 },
              { file: 'trackpod_export.csv', date: 'Ayer, 18:45', status: 'warning', rows: 89, errors: 2 },
              { file: 'farmaloop_rutas.xls', date: '22 Oct, 10:15', status: 'error', rows: 0, errors: 'Formato inválido' },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-start space-x-3 hover:bg-slate-50 transition-colors">
                <div className="shrink-0 mt-0.5">
                  {item.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {item.status === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                  {item.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{item.file}</p>
                  <div className="flex items-center text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.date}
                  </div>
                  {item.status === 'success' && <p className="text-xs text-slate-500 mt-1">{item.rows} filas importadas</p>}
                  {item.status === 'warning' && <p className="text-xs text-amber-600 mt-1">{item.rows} importadas, {item.errors} errores</p>}
                  {item.status === 'error' && <p className="text-xs text-red-600 mt-1">Error: {item.errors}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Ver todo el historial</button>
          </div>
        </div>
      </div>
    </div>
  );
};
