import React, { useState } from 'react';
import { Order, OrderStatus } from './types/Order';
import { DispatcherView } from './components/DispatcherView';
import { DriverView } from './components/DriverView';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dispatcher' | 'driver'>('dispatcher');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setOrders(orders.map(order => 
        order.id === editingId 
          ? { ...order, ...formData }
          : order
      ));
      setEditingId(null);
    } else {
      const newOrder: Order = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        direccion: formData.direccion || '',
        cantidad: formData.cantidad || 0,
        formaDePago: formData.formaDePago || 'Cash',
        pago: false,
        estado: 'pendiente',
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.direccion || '')}`
      };
      setOrders([...orders, newOrder]);
    }
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: string) => {
    const orderToEdit = orders.find(order => order.id === id);
    if (orderToEdit) {
      setFormData(orderToEdit);
      setEditingId(id);
    }
  };

  const handleCancel = (id: string) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, estado: 'cancelado' as OrderStatus } : order
    ));
  };

  const handleStatusChange = (id: string) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        const nextStatus: Record<OrderStatus, OrderStatus> = {
          'pendiente': 'en-proceso',
          'en-proceso': 'completado',
          'completado': 'completado',
          'cancelado': 'cancelado'
        };
        // When moving to completed status, automatically set pago to true
        const newStatus = nextStatus[order.estado];
        return {
          ...order,
          estado: newStatus,
          pago: newStatus === 'completado' ? true : order.pago
        };
      }
      return order;
    }));
  };

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tutebonomi:<db_password>@elsanti.azv2f.mongodb.net/?retryWrites=true&w=majority&appName=ElSanti";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


  const handlePaymentToggle = (id: string) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, pago: !order.pago } : order
    ));
  };

  const handleResetDay = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el día? Esto eliminará todos los pedidos.')) {
      setOrders([]);
      setFormData({});
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Coffee Delivery System</h1>
          <div className="space-x-4">
            <button
              onClick={() => setViewMode('dispatcher')}
              className={`px-4 py-2 rounded ${
                viewMode === 'dispatcher'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Dispatcher View
            </button>
            <button
              onClick={() => setViewMode('driver')}
              className={`px-4 py-2 rounded ${
                viewMode === 'driver'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Driver View
            </button>
          </div>
        </div>

        {viewMode === 'dispatcher' ? (
          <DispatcherView
            orders={orders}
            formData={formData}
            editingId={editingId}
            onFormSubmit={handleFormSubmit}
            onInputChange={handleInputChange}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onPaymentToggle={handlePaymentToggle}
            onResetDay={handleResetDay}
          />
        ) : (
          <DriverView
            orders={orders}
            onStatusChange={handleStatusChange}
            onPaymentToggle={handlePaymentToggle}
          />
        )}
      </div>
    </div>
  );
}

export default App;