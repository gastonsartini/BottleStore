import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { createUnauthenticatedClient } from '@/lib/supabase/server';
import { Tag, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ofertas y Promociones | BottleStore',
  description: 'Descubre nuestras mejores ofertas en botellas de agua premium. Descuentos especiales y promociones exclusivas.',
};

export default async function OffersPage() {
  const supabase = createUnauthenticatedClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or('active.eq.true,active.is.null')
    .not('sale_price', 'is', null)
    .order('created_at', { ascending: false });

  console.log('🏷️ Offers products result:', { products, count: products?.length });

  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .eq('active', true)
    .gte('valid_until', new Date().toISOString())
    .lte('valid_from', new Date().toISOString());

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Ofertas Especiales
              </h1>
            </div>
            <p className="text-xl text-white/90">
              Aprovecha nuestros descuentos exclusivos en botellas premium
            </p>
          </div>
        </div>

        {coupons && coupons.length > 0 && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cupones Disponibles
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="border-2 border-dashed border-primary-300 bg-primary-50 rounded-lg p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500 opacity-10 rounded-full -mr-10 -mt-10" />
                    <div className="flex items-start justify-between mb-3">
                      <Tag className="w-6 h-6 text-primary-600" />
                      <span className="text-xs text-primary-700 bg-primary-100 px-2 py-1 rounded">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% OFF`
                          : `$${coupon.discount_value} OFF`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {coupon.code}
                    </h3>
                    {coupon.min_purchase && (
                      <p className="text-sm text-gray-600 mb-2">
                        Compra mínima: ${coupon.min_purchase}
                      </p>
                    )}
                    {coupon.max_uses && (
                      <p className="text-xs text-gray-500">
                        Usos disponibles: {coupon.max_uses - coupon.current_uses}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Productos en Oferta
          </h2>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay ofertas activas
              </h3>
              <p className="text-gray-600 mb-6">
                Vuelve pronto para descubrir nuevas promociones
              </p>
              <a
                href="/productos"
                className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Ver todos los productos
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
