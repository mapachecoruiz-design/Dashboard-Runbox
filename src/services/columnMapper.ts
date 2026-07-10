export type StandardField =
  | 'clientOrderId'
  | 'clientId'
  | 'createdAt'
  | 'pickupDate'
  | 'deliveryDate'
  | 'commune'
  | 'region'
  | 'address'
  | 'status'
  | 'serviceType'
  | 'driverId'
  | 'routeId'
  | 'packagesCount'
  | 'weight'
  | 'chargedTariff'
  | 'estimatedCost'
  | 'estimatedMargin'
  | 'failureReason'
  | 'notes'
  | 'podLink';

export const standardFieldsList = [
  { id: 'clientOrderId', label: 'ID Pedido Cliente' },
  { id: 'clientId', label: 'Cliente (ID/Nombre)' },
  { id: 'createdAt', label: 'Fecha Creación' },
  { id: 'pickupDate', label: 'Fecha Retiro' },
  { id: 'deliveryDate', label: 'Fecha Entrega' },
  { id: 'commune', label: 'Comuna' },
  { id: 'region', label: 'Región' },
  { id: 'address', label: 'Dirección' },
  { id: 'status', label: 'Estado' },
  { id: 'serviceType', label: 'Tipo de Servicio' },
  { id: 'driverId', label: 'Chofer (ID/Nombre)' },
  { id: 'routeId', label: 'Ruta' },
  { id: 'packagesCount', label: 'Cantidad Bultos' },
  { id: 'weight', label: 'Peso' },
  { id: 'chargedTariff', label: 'Tarifa Cobrada' },
  { id: 'estimatedCost', label: 'Costo Estimado' },
  { id: 'estimatedMargin', label: 'Margen Estimado' },
  { id: 'failureReason', label: 'Razón Fallo' },
  { id: 'notes', label: 'Notas' },
  { id: 'podLink', label: 'Enlace POD' }
];

export const getSuggestedMapping = (columns: string[]): Record<string, StandardField> => {
  const mapping: Record<string, StandardField> = {};
  
  const rules = [
    { field: 'clientOrderId' as StandardField, keywords: ['pedido', 'order', 'id pedido', 'numero pedido', 'orden'] },
    { field: 'clientId' as StandardField, keywords: ['cliente', 'client', 'customer'] },
    { field: 'createdAt' as StandardField, keywords: ['creado', 'created', 'fecha creacion'] },
    { field: 'pickupDate' as StandardField, keywords: ['retiro', 'pickup', 'fecha retiro'] },
    { field: 'deliveryDate' as StandardField, keywords: ['fecha', 'date', 'fecha entrega', 'delivery'] },
    { field: 'commune' as StandardField, keywords: ['comuna', 'city', 'ciudad', 'destination city'] },
    { field: 'region' as StandardField, keywords: ['region', 'región', 'provincia'] },
    { field: 'address' as StandardField, keywords: ['dirección', 'address', 'direccion'] },
    { field: 'status' as StandardField, keywords: ['estado', 'status'] },
    { field: 'serviceType' as StandardField, keywords: ['servicio', 'service type', 'tipo servicio'] },
    { field: 'driverId' as StandardField, keywords: ['chofer', 'driver', 'conductor'] },
    { field: 'routeId' as StandardField, keywords: ['ruta', 'route'] },
    { field: 'packagesCount' as StandardField, keywords: ['bultos', 'packages', 'cajas', 'cantidad'] },
    { field: 'weight' as StandardField, keywords: ['peso', 'weight', 'kg'] },
    { field: 'chargedTariff' as StandardField, keywords: ['tarifa', 'precio', 'price', 'cobro'] },
    { field: 'estimatedCost' as StandardField, keywords: ['costo', 'cost'] },
    { field: 'estimatedMargin' as StandardField, keywords: ['margen', 'margin'] },
    { field: 'failureReason' as StandardField, keywords: ['razon fallo', 'motivo', 'failure reason', 'motivo rechazo'] },
    { field: 'notes' as StandardField, keywords: ['notas', 'notes', 'observaciones'] },
    { field: 'podLink' as StandardField, keywords: ['pod', 'enlace pod', 'link', 'proof of delivery'] },
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
