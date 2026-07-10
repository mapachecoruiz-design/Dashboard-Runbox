export type ClientId = 
  | 'booz'
  | 'booz_ruta_normal'
  | 'booz_ruta_colina'
  | 'booz_ruta_express'
  | 'booz_concepcion'
  | 'booz_pedidos_grandes'
  | 'bazar_revistas'
  | 'farmaloop_9am'
  | 'farmaloop_express_12m'
  | 'farmaloop_express_3pm'
  | 'farmaloop_fertilidad'
  | 'farmaloop_mutual'
  | 'liga'
  | 'liga_stgo'
  | 'liche_concepcion'
  | 'recetarios_concepcion'
  | 'recetarios_santiago'
  | 'marketcare'
  | 'sesfar'
  | 'rosaria'
  | 'mundo_gato'
  | 'el_reinal'
  | 'yapp'
  | 'lo_barnechea'
  | 'farplus'
  | 'la_reina'
  | 'farmafull'
  | 'medicca'
  | 'farmaz'
  | 'liche'
  | 'valdivia'
  | 'intent'
  | 'edark_store';

export interface Client {
  id: ClientId;
  name: string;
  isAgrupador?: boolean;
  subClients?: ClientId[];
}

export const clients: Client[] = [
  { id: 'booz', name: 'Booz', isAgrupador: true, subClients: ['booz_ruta_normal', 'booz_ruta_colina', 'booz_ruta_express', 'booz_concepcion', 'booz_pedidos_grandes'] },
  { id: 'booz_ruta_normal', name: 'Booz Ruta Normal' },
  { id: 'booz_ruta_colina', name: 'Booz Ruta Colina' },
  { id: 'booz_ruta_express', name: 'Booz Ruta Express' },
  { id: 'booz_concepcion', name: 'Booz Concepción' },
  { id: 'booz_pedidos_grandes', name: 'Pedidos grandes y otros Booz' },
  
  { id: 'bazar_revistas', name: 'Bazar Revistas' },
  
  { id: 'farmaloop_9am', name: 'Farmaloop 9 AM' },
  { id: 'farmaloop_express_12m', name: 'Farmaloop Express 12M' },
  { id: 'farmaloop_express_3pm', name: 'Farmaloop Express 3PM' },
  { id: 'farmaloop_fertilidad', name: 'Farmaloop Fertilidad' },
  { id: 'farmaloop_mutual', name: 'Farmaloop Mutual' },
  
  { id: 'liga', name: 'Liga', isAgrupador: true, subClients: ['liga_stgo', 'liche_concepcion', 'recetarios_concepcion', 'recetarios_santiago'] },
  { id: 'liga_stgo', name: 'Liga STGO' },
  { id: 'liche_concepcion', name: 'Liche Concepción' },
  { id: 'recetarios_concepcion', name: 'Recetarios Concepción' },
  { id: 'recetarios_santiago', name: 'Recetarios Santiago' },
  
  { id: 'marketcare', name: 'MarketCare' },
  { id: 'sesfar', name: 'Sesfar' },
  { id: 'rosaria', name: 'Rosaria' },
  { id: 'mundo_gato', name: 'Mundo Gato' },
  { id: 'el_reinal', name: 'El Reinal' },
  
  { id: 'yapp', name: 'Yapp', isAgrupador: true, subClients: ['lo_barnechea', 'farplus', 'la_reina', 'farmafull', 'medicca', 'farmaz', 'liche', 'valdivia'] },
  { id: 'lo_barnechea', name: 'Lo Barnechea' },
  { id: 'farplus', name: 'Farplus' },
  { id: 'la_reina', name: 'La Reina' },
  { id: 'farmafull', name: 'Famafull' },
  { id: 'medicca', name: 'Medicca' },
  { id: 'farmaz', name: 'Farmaz' },
  { id: 'liche', name: 'Liche' },
  { id: 'valdivia', name: 'Valdivia' },
  
  { id: 'intent', name: 'Intent' },
  { id: 'edark_store', name: 'eDark Store' },
];
