import React from 'react';
import { MapPin, Coffee, CreditCard, Clock, DollarSign } from 'lucide-react';
import { Order } from '../types/Order';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '../utils/currency';

interface OrderCardProps {
  order: Order;
  onEdit?: (id: string) => void;
  onStatusChange?: (id: string) => void;
  onPaymentToggle?: (id: string) => void;
  onCancel?: (id: string) => void;
  isDriver?: boolean;
  isDispatcher?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onEdit,
  onStatusChange,
  onPaymentToggle,
  onCancel,
  isDriver,
  isDispatcher,
}) => {
  const getStatusColor = (status: Order['estado']) => {
    switch (status) {
      case 'pendiente':
        return 'text-yellow-600';
      case 'en-proceso':
        return 'text-blue-600';
      case 'completado':
        return 'text-green-600';
      case 'cancelado':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">Pedido #{order.id}</h3>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(order.timestamp), {
                addSuffix: true,
                locale: es,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <a
              href={order.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {order.direccion}
            </a>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Coffee className="w-5 h-5" />
            <span>{order.cantidad} vasos</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <CreditCard className="w-5 h-5" />
            <span>
              {formatCurrency(order.cantidad * 1000)} -{' '}
              {order.formaDePago === 'Cash' ? 'Efectivo' : 'Transferencia'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className={`font-medium ${getStatusColor(order.estado)}`}>
              {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
            </span>
            <span className={order.pago ? 'text-green-600' : 'text-red-600'}>
              ({order.pago ? 'Pagado' : 'No pagado'})
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          {/* Driver Controls */}
          {isDriver && order.estado !== 'cancelado' && (
            <button
              className={`px-4 py-2 text-white rounded ${
                order.estado === 'pendiente'
                  ? 'bg-blue-500 hover:bg-blue-700'
                  : order.estado === 'en-proceso'
                  ? 'bg-green-500 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={() => onStatusChange?.(order.id)}
              disabled={order.estado === 'completado'}
            >
              {order.estado === 'pendiente'
                ? 'Iniciar'
                : order.estado === 'en-proceso'
                ? 'Completar'
                : 'Finalizado'}
            </button>
          )}

          {/* Dispatcher Controls */}
          {isDispatcher && (
            <div className="space-y-2">
              {!order.pago && order.estado !== 'cancelado' && (
                <button
                  onClick={() => onPaymentToggle?.(order.id)}
                  className="w-full px-4 py-2 text-white rounded bg-green-500 hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Marcar Pagado</span>
                </button>
              )}
              
              {order.estado !== 'completado' && order.estado !== 'cancelado' && (
                <>
                  <button
                    onClick={() => onEdit?.(order.id)}
                    className="w-full px-4 py-2 text-white rounded bg-yellow-500 hover:bg-yellow-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onCancel?.(order.id)}
                    className="w-full px-4 py-2 text-white rounded bg-red-500 hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};