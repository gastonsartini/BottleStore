'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors"
            disabled={isOutOfStock}
          >
            -
          </button>
          <span className="px-6 py-2 font-medium border-x border-gray-300">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors"
            disabled={isOutOfStock || quantity >= product.stock}
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-600">
          {product.stock} disponibles
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || added}
        className={`w-full font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          isOutOfStock
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : added
            ? 'bg-green-500 text-white'
            : 'bg-primary-500 hover:bg-primary-600 text-white'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
          </>
        )}
      </button>
    </div>
  );
}
