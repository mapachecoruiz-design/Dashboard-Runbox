import React, { useState } from 'react';
import { Settings as SettingsIcon, AlertTriangle, RefreshCw, CheckCircle, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Settings = () => {
  const { resetData } = useAppContext();
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas restablecer los datos demo? Esto borrará todas las importaciones y ajustes realizados, volviendo a los datos iniciales. Esta acción no se puede deshacer.')) {
      setIsResetting(true);
      setTimeout(() => {
        resetData();
        setIsResetting(false);
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
      }, 800);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-indigo-600" />
            Configuración
          </h1>
          <p className="text-slate-500 mt-1">Administra los ajustes del sistema y almacenamiento</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Almacenamiento Local</h2>
              <p className="text-sm text-slate-500">Gestión de datos almacenados en el navegador</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                Restablecer datos demo
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Borra todos los datos actuales de la memoria del navegador (pedidos, clientes, ajustes, importaciones) y vuelve a cargar los datos de demostración originales.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Restableciendo...
                  </>
                ) : resetSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Restablecido</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Restablecer Datos
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
