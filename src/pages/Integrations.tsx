import React, { useState } from 'react';
import { 
  Puzzle, 
  Settings2, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Globe, 
  AlertCircle 
} from 'lucide-react';

type IntegrationStatus = 'connected' | 'disconnected' | 'error';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: React.FC<{ className?: string }>;
  type: 'TMS' | 'WMS' | 'ERP' | 'Ecommerce' | 'Other';
  lastSync?: string;
  errorMsg?: string;
}

const mockIntegrations: Integration[] = [
  {
    id: 'trackpod',
    name: 'Track-Pod',
    description: 'Sistema TMS para gestión de rutas y última milla.',
    status: 'connected',
    icon: Globe,
    type: 'TMS',
    lastSync: 'Hace 5 minutos'
  },
  {
    id: 'booz',
    name: 'Booz API',
    description: 'Conexión directa con la API del cliente Booz.',
    status: 'disconnected',
    icon: Puzzle,
    type: 'Other'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Importación automática de pedidos desde Shopify.',
    status: 'error',
    icon: Globe,
    type: 'Ecommerce',
    lastSync: 'Hace 2 horas',
    errorMsg: 'Credenciales inválidas'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Sincronización de órdenes y actualización de estados.',
    status: 'disconnected',
    icon: Globe,
    type: 'Ecommerce'
  }
];

export const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedIntegration) return;
    
    setIntegrations(prev => prev.map(int => {
      if (int.id === selectedIntegration.id) {
        return {
          ...int,
          status: 'connected',
          lastSync: 'Recién ahora',
          errorMsg: undefined
        };
      }
      return int;
    }));
    
    setIsModalOpen(false);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        return {
          ...int,
          status: 'disconnected',
          lastSync: undefined,
          errorMsg: undefined
        };
      }
      return int;
    }));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integraciones y API</h1>
          <p className="text-slate-500 mt-1">Conecta RunBox con sistemas externos como Track-Pod, Booz, Shopify, etc.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <integration.icon className="w-6 h-6" />
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                  ${integration.status === 'connected' ? 'bg-green-50 text-green-700 border-green-200' : 
                    integration.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                    'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {integration.status === 'connected' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {integration.status === 'error' && <XCircle className="w-3.5 h-3.5" />}
                  {integration.status === 'disconnected' && <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                  {integration.status === 'connected' ? 'Conectado' : 
                   integration.status === 'error' ? 'Error' : 'Desconectado'}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{integration.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{integration.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Tipo:</span>
                  <span className="font-medium text-slate-700">{integration.type}</span>
                </div>
                {integration.lastSync && (
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Última sinc:</span>
                    <span className="font-medium text-slate-700">{integration.lastSync}</span>
                  </div>
                )}
                {integration.errorMsg && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{integration.errorMsg}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              {integration.status === 'connected' ? (
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => handleConnect(integration)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
                  >
                    <Settings2 className="w-4 h-4" />
                    Configurar
                  </button>
                  <button 
                    onClick={() => handleDisconnect(integration.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Desconectar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleConnect(integration)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Conectar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedIntegration && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Configurar {selectedIntegration.name}</h2>
              <p className="text-sm text-slate-500 mt-1">Ingresa las credenciales para la conexión API.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API Key / Token</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_test_..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Esta clave se guardará de forma encriptada en nuestros servidores.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar Conexión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
