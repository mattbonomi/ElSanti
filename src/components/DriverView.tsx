import React from 'react';
import { Order } from '../types/Order';
import { OrderCard } from './OrderCard';

interface DriverViewProps {
  orders: Order[];
  onStatusChange: (id: string) => void;
  onPaymentToggle: (id: string) => void;
}

export const DriverView: React.FC<DriverViewProps> = ({
  orders,
  onStatusChange,
  onPaymentToggle,
}) => {
  const activeOrders = orders.filter(
    order => order.estado !== 'cancelado' && order.estado !== 'completado'
  );

  // Calculate total products from completed orders
  const completedOrders = orders.filter(order => order.estado === 'completado');
  const totalProductsServed = completedOrders.reduce((sum, order) => sum + order.cantidad, 0);

  return (
    <div className="space-y-4">
      {/* Summary Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-lg font-semibold text-gray-700">
          Total Products Served: <span className="text-green-600">{totalProductsServed}</span>
          <span className="text-sm text-gray-500 ml-2">
            (from {completedOrders.length} completed orders)
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
      {activeOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active orders at the moment</p>
      ) : (
        activeOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
            onPaymentToggle={onPaymentToggle}
            isDriver={true}
          />
        ))
      )}
    </div>
  );
};