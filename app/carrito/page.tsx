'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center py-12">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              Agrega productos para comenzar tu compra
            </p>
            <Link
              href="/productos"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Carrito de Compras
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {items.map((item) => {
                  const price = item.product.sale_price || item.product.price;
                  const itemTotal = price * item.quantity;
                  const mainImage = Array.isArray(item.product.images) && item.product.images.length > 0
                    ? item.product.images[0]
                    : '/placeholder-bottle.jpg';

                  return (
                    <div key={`${item.product.id}-${item.variant?.id}`} className="p-6">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src={mainImage}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product.capacity} • {item.product.color}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            ${price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                          <button
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            className="text-red-500 hover:text-red-600 p-1"
                            aria-label="Eliminar del carrito"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity >= item.product.stock}
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-lg font-bold text-gray-900">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <h2 className="font-semibold text-lg text-gray-900 mb-4">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-sm">Calculado en checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold text-center px-6 py-3 rounded-lg transition-colors mb-3"
                >
                  Iniciar Compra
                </Link>

                <Link
                  href="/productos"
                  className="block w-full text-primary-600 hover:text-primary-700 font-medium text-center px-6 py-3"
                >
                  Seguir Comprando
                </Link>

                {subtotal < 5000 && (
                  <div className="mt-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
                    <p className="text-sm text-accent-800">
                      <span className="font-semibold">¡Envío gratis!</span> Te faltan ${(5000 - subtotal).toFixed(2)} para envío sin cargo
                    </p>
                    <div className="w-full bg-accent-200 h-2 rounded-full mt-2">
                      <div
                        className="bg-accent-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
