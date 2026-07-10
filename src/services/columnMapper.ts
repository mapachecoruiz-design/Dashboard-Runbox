export type StandardField = 
  | 'clientOrderId' 
  | 'cliente' 
  | 'deliveryDate' 
  | 'commune' 
  | 'status' 
  | 'chofer' 
  | 'ruta' 
  | 'packagesCount' 
  | 'address'
  | 'chargedTariff'
  | 'estimatedCost';

export const standardFieldsList = [
  { id: 'clientOrderId', label: 'ID Pedido Cliente' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'deliveryDate', label: 'Fecha Entrega' },
  { id: 'commune', label: 'Comuna' },
  { id: 'address', label: 'Dirección' },
  { id: 'status', label: 'Estado' },
  { id: 'chofer', label: 'Chofer' },
  { id: 'ruta', label: 'Ruta' },
  { id: 'packagesCount', label: 'Cantidad Bultos' },
  { id: 'chargedTariff', label: 'Tarifa Cobrada' },
  { id: 'estimatedCost', label: 'Costo Estimado' },
];

export const getSuggestedMapping = (columns: string[]): Record<string, StandardField> => {
  const mapping: Record<string, StandardField> = {};
  
  const rules = [
    { field: 'clientOrderId' as StandardField, keywords: ['pedido', 'order', 'id pedido', 'numero pedido', 'orden'] },
    { field: 'cliente' as StandardField, keywords: ['cliente', 'client', 'customer'] },
    { field: 'commune' as StandardField, keywords: ['comuna', 'city', 'ciudad', 'destination city'] },
    { field: 'address' as StandardField, keywords: ['dirección', 'address', 'direccion'] },
    { field: 'status' as StandardField, keywords: ['estado', 'status'] },
    { field: 'chofer' as StandardField, keywords: ['chofer', 'driver', 'conductor'] },
    { field: 'ruta' as StandardField, keywords: ['ruta', 'route'] },
    { field: 'packagesCount' as StandardField, keywords: ['bultos', 'packages', 'cajas', 'cantidad'] },
    { field: 'deliveryDate' as StandardField, keywords: ['fecha', 'date', 'fecha entrega'] },
    { field: 'chargedTariff' as StandardField, keywords: ['tarifa', 'precio', 'price', 'cobro'] },
    { field: 'estimatedCost' as StandardField, keywords: ['costo', 'cost'] },
  ];

  columns.forEach(col => {
    const lowerCol = col.toLowerCase().trim();
    for (const rule of rules) {
      if (rule.keywords.some(kw => lowerCol.includes(kw) || kw === lowerCol)) {
        if (!Object.values(mapping).includes(rule.field)) {
           mapping[col] = rule.field;
           break;
        }
      }
    }
  });

  return mapping;
};
