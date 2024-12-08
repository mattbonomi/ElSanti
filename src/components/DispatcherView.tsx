import React from 'react';
import { Order } from '../types/Order';
import { OrderForm } from './OrderForm';
import { OrderCard } from './OrderCard';

interface DispatcherViewProps {
  orders: Order[];
  formData: Partial<Order>;
  editingId: string | null;
  onFormSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onPaymentToggle: (id: string) => void;
  onResetDay: () => void;
}

export const DispatcherView: React.FC<DispatcherViewProps> = ({
  orders,
  formData,
  editingId,
  onFormSubmit,
  onInputChange,
  onEdit,
  onCancel,
  onPaymentToggle,
  onResetDay,
}) => {
  // Get completed orders
  const completedOrders = orders.filter(order => order.estado === 'completado');

  // Calculate total products from completed orders
  const totalProductsServed = completedOrders.reduce((sum, order) => sum + order.cantidad, 0);

  // Download completed orders as CSV
  const handleDownloadCompletedOrders = () => {
    const csvContent = [
      ['Order ID', 'Products', 'Payment Method', 'Status', 'Address', 'Timestamp'], // CSV Headers
      ...completedOrders.map(order => [
        order.id,
        order.cantidad,
        order.formaDePago,
        order.estado,
        order.direccion,
        order.timestamp,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `completed_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Order Form */}
      <OrderForm
        formData={formData}
        editingId={editingId}
        onSubmit={onFormSubmit}
        onChange={onInputChange}
      />

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onResetDay}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reset Day
          </button>
          <button
            onClick={handleDownloadCompletedOrders}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Download Completed Orders
          </button>
        </div>

        {/* Summary */}
        <div className="text-lg font-semibold text-gray-700">
          Total Products Served: <span className="text-green-600">{totalProductsServed}</span>
          <span className="text-sm text-gray-500 ml-2">
            (from {completedOrders.length} completed orders)
          </span>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="text-2xl font-bold mt-8 mb-4">Todos los Pedidos</h2>
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={onEdit}
              onCancel={onCancel}
              isDriver={false}
              onPaymentToggle={onPaymentToggle}
              isDispatcher={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};