'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, ShoppingCart, Settings, LogOut, Store } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-gray-900 min-h-screen text-white relative">
          <div className="p-6">
            <Link href="/admin" className="text-2xl font-bold">
              BottleStore Admin
            </Link>
          </div>

          <nav className="px-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/productos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Package className="w-5 h-5" />
              Productos
            </Link>
            <Link
              href="/admin/categorias"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Tag className="w-5 h-5" />
              Categorías
            </Link>
            <Link
              href="/admin/ordenes"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Órdenes
            </Link>
            <Link
              href="/admin/configuracion"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </nav>

          <div className="absolute bottom-6 left-4 right-4 space-y-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <Store className="w-5 h-5" />
              Ver Tienda
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
