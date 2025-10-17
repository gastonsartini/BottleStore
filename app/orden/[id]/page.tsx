import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { createUnauthenticatedClient } from '@/lib/supabase/server';
import { CheckCircle, Package, Truck, Mail, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const supabase = createUnauthenticatedClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address as any;
  const items = order.items as any[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Pedido Confirmado!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Gracias por tu compra en BottleStore
            </p>
            <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Número de orden:</span>
              <span className="text-lg font-bold text-gray-900 ml-2">
                {order.order_number}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información del Pedido
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email de confirmación enviado a:</p>
                  <p className="font-medium text-gray-900">{order.customer_email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono de contacto:</p>
                  <p className="font-medium text-gray-900">{order.customer_phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Dirección de envío:</p>
                  <p className="font-medium text-gray-900">
                    {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}
                  </p>
                  <p className="text-sm text-gray-600">CP: {shippingAddress.postalCode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Productos
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-medium">${order.shipping_cost.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span className="font-medium">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-primary-900 mb-2">¿Qué sigue?</h3>
            <ul className="space-y-2 text-sm text-primary-800">
              <li>✓ Recibirás un email de confirmación con los detalles de tu pedido</li>
              <li>✓ Prepararemos tu pedido con cuidado</li>
              <li>✓ Te notificaremos cuando tu pedido sea enviado con el número de tracking</li>
              <li>✓ Recibirás tu pedido en {order.shipping_provider || 'el tiempo estimado'}</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/productos"
              className="flex-1 text-center bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Seguir Comprando
            </Link>
            <a
              href={`https://wa.me/5491112345678?text=Hola, consulto por mi pedido ${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
