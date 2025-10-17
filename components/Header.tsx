'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, Droplet, Settings } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                BottleStore
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/productos"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Productos
              </Link>
              <Link
                href="/productos?category=botellas-metalicas"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Metálicas
              </Link>
              <Link
                href="/productos?category=botellas-plasticas"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Plásticas
              </Link>
              <Link
                href="/ofertas"
                className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
              >
                Ofertas
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/carrito"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Administración"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Admin</span>
            </Link>

            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/productos"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Todos los Productos
              </Link>
              <Link
                href="/productos?category=botellas-metalicas"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Botellas Metálicas
              </Link>
              <Link
                href="/productos?category=botellas-plasticas"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Botellas Plásticas
              </Link>
              <Link
                href="/ofertas"
                className="text-accent-600 hover:text-accent-700 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ofertas Especiales
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium pt-2 border-t border-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Administración
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
