import Link from 'next/link';
import { ArrowRight, Droplets, Sparkles, Truck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { createUnauthenticatedClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = createUnauthenticatedClient();

  console.log('🔍 Fetching featured products...');
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .or('featured.eq.true,featured.is.null')
    .or('active.eq.true,active.is.null')
    .limit(6);

  console.log('📦 Featured products result:', { featuredProducts, count: featuredProducts?.length });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Hidratación con el mejor{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                    Estilo
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Descubre nuestra colección de botellas premium. Diseños únicos que se adaptan a tu estilo de vida activo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/productos"
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                  >
                    Ver Catálogo
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/ofertas"
                    className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
                  >
                    Ver Ofertas
                    <Sparkles className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 blur-3xl"></div>
                <div className="relative bg-white/80 backdrop-blur rounded-2xl p-8 shadow-xl">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Calidad Premium
                </h3>
                <p className="text-gray-600">
                  Materiales de primera calidad, libres de BPA y seguros para tu salud
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Envío Rápido
                </h3>
                <p className="text-gray-600">
                  Envíos a todo el país. Gratis en compras superiores a $5.000
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Diseños Únicos
                </h3>
                <p className="text-gray-600">
                  Colección exclusiva con diseños modernos y colores vibrantes
                </p>
              </div>
            </div>
          </div>
        </section>

        {featuredProducts && featuredProducts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Productos Destacados
                </h2>
                <p className="text-lg text-gray-600">
                  Las botellas más populares de nuestra colección
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Ver todos los productos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-gradient-to-br from-accent-500 to-accent-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¡Ofertas de Verano!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Hasta 25% OFF en productos seleccionados. Usa el código{' '}
              <span className="font-bold">VERANO2024</span>
            </p>
            <Link
              href="/ofertas"
              className="inline-flex items-center gap-2 bg-white text-accent-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Ver Ofertas
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
