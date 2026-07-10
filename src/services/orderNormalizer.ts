import { Order, OrderStatus } from '../types';
import { clients } from '../data/clients';

export const normalizeStatus = (statusStr: string): OrderStatus => {
  if (!statusStr) return 'pendiente';
  const s = String(statusStr).toLowerCase().trim();
  
  if (['delivered', 'entregada', 'ok', 'éxito', 'exito', 'entregado'].includes(s)) return 'entregado';
  if (['failed', 'no entregado', 'fallida', 'rechazo', 'fallido'].includes(s)) return 'fallido';
  if (['route', 'in route', 'en reparto', 'en ruta', 'en_ruta'].includes(s)) return 'en_ruta';
  if (['return', 'returned', 'devolución', 'devolucion', 'devuelto'].includes(s)) return 'devuelto';
  if (['pending', 'pendiente'].includes(s)) return 'pendiente';
  if (['reentrega'].includes(s)) return 'reentrega';
  
  return 'pendiente';
};

export const normalizeDate = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch (e) {}
  
  const match = String(dateStr).match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return String(dateStr).split(' ')[0];
};

export const findClientId = (clientName: string): string => {
  if (!clientName) return 'desconocido';
  const c = clients.find(c => c.name.toLowerCase() === String(clientName).toLowerCase().trim());
  return c ? c.id : String(clientName).trim();
};
