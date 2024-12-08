import React from 'react';
import { Order } from '../types/Order';

interface OrderFormProps {
  formData: Partial<Order>;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  editingId,
  onSubmit,
  onChange,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? 'Editar Pedido' : 'Nuevo Pedido'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">
            Cantidad
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            min="1"
            value={formData.cantidad || ''}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="formaDePago" className="block text-sm font-medium text-gray-700">
            Forma de Pago
          </label>
          <select
            id="formaDePago"
            name="formaDePago"
            value={formData.formaDePago || 'Cash'}
            onChange={onChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="Cash">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {editingId ? 'Actualizar Pedido' : 'Crear Pedido'}
        </button>
      </div>
    </form>
  );
};