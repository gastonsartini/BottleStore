'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/store/cart';
import { calculateShipping, validatePostalCode } from '@/utils/shipping';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Truck, CreditCard, ShoppingBag, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    identification: '',
  });

  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
  });

  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getSubtotal();
  const total = subtotal - discount + (shippingCost || 0);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [items, router]);

  useEffect(() => {
    if (shippingData.postalCode.length >= 4) {
      const shipping = calculateShipping(shippingData.postalCode);
      if (shipping) {
        setShippingCost(shipping.cost);
        setShippingInfo(shipping);
      } else {
        setShippingCost(null);
        setShippingInfo(null);
      }
    }
  }, [shippingData.postalCode]);

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.identification) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.street || !shippingData.city || !shippingData.state || !shippingData.postalCode) {
      setError('Por favor completa todos los campos de envío');
      return;
    }
    if (!validatePostalCode(shippingData.postalCode)) {
      setError('Código postal inválido');
      return;
    }
    if (!shippingCost) {
      setError('No se pudo calcular el costo de envío para este código postal');
      return;
    }
    setError('');
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('=== CLIENT: Starting order placement ===');
      const orderData = {
        order_number: `BS-${Date.now()}`,
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_identification: customerData.identification,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images[0] || '',
          quantity: item.quantity,
          unit_price: item.product.sale_price || item.product.price,
          total: (item.product.sale_price || item.product.price) * item.quantity,
        })),
        subtotal,
        discount,
        shipping_cost: shippingCost || 0,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'mercadopago',
        shipping_address: shippingData,
        shipping_provider: shippingInfo?.provider || 'Standard',
      };

      console.log('CLIENT: Order data:', orderData);
      console.log('CLIENT: Sending request to /api/orders');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      console.log('CLIENT: Response status:', response.status);

      const responseText = await response.text();
      console.log('CLIENT: Response body:', responseText);

      if (!response.ok) {
        console.error('CLIENT: ❌ Response not ok');
        let errorMessage = 'Error al crear la orden';
        try {
          const errorData = JSON.parse(responseText);
          console.error('CLIENT: Error details:', errorData);
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch (e) {
          console.error('CLIENT: Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = JSON.parse(responseText);
      console.log('CLIENT: ✅ Success response:', data);

      const { orderId, paymentUrl } = data;

      if (paymentUrl) {
        console.log('CLIENT: Redirecting to payment URL:', paymentUrl);
        clearCart();
        window.location.href = paymentUrl;
      } else {
        console.log('CLIENT: Redirecting to order page:', orderId);
        clearCart();
        router.push(`/orden/${orderId}`);
      }
    } catch (err) {
      console.error('CLIENT: ❌ Error in handlePlaceOrder:', err);
      setError(`Error al procesar la orden: ${err instanceof Error ? err.message : 'Por favor intenta nuevamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="hidden sm:inline font-medium">Datos</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary-500' : 'bg-gray-300'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="hidden sm:inline font-medium">Envío</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary-500' : 'bg-gray-300'}`} />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-500 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="hidden sm:inline font-medium">Pago</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Datos de Contacto
                  </h2>
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="juan@ejemplo.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1123456789"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Sin espacios ni guiones (ej: 1123456789)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DNI
                      </label>
                      <input
                        type="text"
                        value={customerData.identification}
                        onChange={(e) => setCustomerData({ ...customerData, identification: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="12345678"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Continuar a Envío
                    </button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Datos de Envío
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={shippingData.street}
                        onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Av. Corrientes 1234"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Buenos Aires"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Provincia
                        </label>
                        <input
                          type="text"
                          value={shippingData.state}
                          onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="CABA"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="1406"
                        required
                      />
                      {shippingInfo && (
                        <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                          <p className="text-sm text-primary-800">
                            <span className="font-medium">Envío {shippingInfo.zone}</span> - ${shippingInfo.cost} ({shippingInfo.estimatedDays} días hábiles)
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        value={shippingData.notes}
                        onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={3}
                        placeholder="Ej: Timbre roto, llamar por teléfono"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Volver
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                      >
                        Continuar a Pago
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Método de Pago
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 border-2 border-primary-500 rounded-lg bg-primary-50">
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                        <span className="font-semibold text-gray-900">Mercado Pago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Paga con tarjeta de crédito, débito o efectivo a través de Mercado Pago
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Resumen de tu pedido</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Productos ({items.length})</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Envío</span>
                        <span className="font-medium">${shippingCost?.toFixed(2) || '0.00'}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento</span>
                          <span className="font-medium">-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Volver
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Tu Pedido
                </h2>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => {
                    const mainImage = item.product.images?.[0] || '/placeholder-bottle.jpg';
                    return (
                      <div key={`${item.product.id}`} className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src={mainImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            ${((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="font-medium">
                      {shippingCost ? `$${shippingCost.toFixed(2)}` : 'A calcular'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
