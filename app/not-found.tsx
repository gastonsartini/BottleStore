import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>
            <Link
              href="/productos"
              className="inline-flex items-center justify-center gap-2 border border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              Ver Productos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
