'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Imagen
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Producto
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Categoría
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Precio
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Stock
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => {
                const mainImage = product.images?.[0] || '/placeholder-bottle.jpg';
                const displayPrice = product.sale_price || product.price;

                return (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {product.categories?.name || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          ${displayPrice.toFixed(2)}
                        </p>
                        {product.sale_price && (
                          <p className="text-sm text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                          product.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : product.stock <= 5
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.active ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Eye className="w-4 h-4" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                          <EyeOff className="w-4 h-4" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${product.id}`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No hay productos. Crea tu primer producto.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
