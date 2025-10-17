import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AddToCartButton } from '@/components/AddToCartButton';
import { createUnauthenticatedClient } from '@/lib/supabase/server';
import { ChevronRight, Package, Truck, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = createUnauthenticatedClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle();

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  return {
    title: product.meta_title || `${product.name} | BottleStore`,
    description: product.meta_description || product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createUnauthenticatedClient();

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id)
    .eq('active', true)
    .neq('id', product.id)
    .limit(4);

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const displayPrice = product.sale_price || product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : '/placeholder-bottle.jpg';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-primary-600">
                Inicio
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/productos" className="text-gray-600 hover:text-primary-600">
                Productos
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
            <div>
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-lg">
                    <span className="font-bold">-{discountPercent}% OFF</span>
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-400 transition-colors cursor-pointer">
                      <Image
                        src={image}
                        alt={`${product.name} - Vista ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through block">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-gray-900">
                    ${displayPrice.toFixed(2)}
                  </span>
                </div>
                {hasDiscount && (
                  <span className="bg-accent-500 text-white px-3 py-1 rounded-lg font-bold">
                    Ahorrás ${(product.price - product.sale_price!).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      <span className="font-semibold">Capacidad:</span> {product.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">
                      <span className="font-semibold">Material:</span>{' '}
                      {product.material === 'metallic' ? 'Metálico' : 'Plástico'}
                    </span>
                  </div>
                </div>

                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-sm">
                    {product.stock > 10 ? (
                      <span className="text-green-600 font-medium">✓ En stock ({product.stock} disponibles)</span>
                    ) : (
                      <span className="text-orange-600 font-medium">⚠ ¡Últimas {product.stock} unidades!</span>
                    )}
                  </div>
                ) : (
                  <span className="text-red-600 font-medium">Sin stock</span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <AddToCartButton product={product} />

                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Consultar por WhatsApp
                </a>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Envíos a todo el país</p>
                    <p className="text-sm text-gray-600">Gratis en compras superiores a $5.000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Compra protegida</p>
                    <p className="text-sm text-gray-600">Garantía de devolución de 30 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedPrice = relatedProduct.sale_price || relatedProduct.price;
                  const relatedImage = relatedProduct.images?.[0] || '/placeholder-bottle.jpg';

                  return (
                    <Link
                      key={relatedProduct.id}
                      href={`/productos/${relatedProduct.slug}`}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-square bg-gray-50">
                        <Image
                          src={relatedImage}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-xl font-bold text-gray-900">
                          ${relatedPrice.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
