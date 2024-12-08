export type OrderStatus = 'pendiente' | 'en-proceso' | 'completado' | 'cancelado';

export interface Order {
  id: string;
  timestamp: string;
  direccion: string;
  cantidad: number;
  formaDePago: 'Cash' | 'Transferencia';
  pago: boolean;
  estado: OrderStatus;
  mapUrl?: string;
}