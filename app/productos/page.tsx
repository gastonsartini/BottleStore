import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { SortSelect } from '@/components/SortSelect';
import { createUnauthenticatedClient } from '@/lib/supabase/server';
import { Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SearchParams {
  category?: string;
  material?: string;
  capacity?: string;
  sort?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createUnauthenticatedClient();

  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .or('active.eq.true,active.is.null');

  console.log('🔍 Base products query created');

  if (searchParams.category) {
    console.log('🏷️ Filtering by category:', searchParams.category);
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.category)
      .maybeSingle();

    if (category) {
      console.log('✅ Category found:', category);
      query = query.eq('category_id', category.id);
    }
  }

  if (searchParams.material) {
    query = query.eq('material', searchParams.material);
  }

  if (searchParams.capacity) {
    query = query.eq('capacity', searchParams.capacity);
  }

  switch (searchParams.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data: products } = await query;

  console.log('📦 Products query result:', { products, count: products?.length });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Nuestros Productos
            </h1>
            <p className="text-gray-600">
              Encuentra la botella perfecta para tu estilo de vida
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <h2 className="font-semibold text-gray-900">Filtros</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Categoría</h3>
                    <div className="space-y-2">
                      {categories?.map((category) => (
                        <a
                          key={category.id}
                          href={`/productos?category=${category.slug}`}
                          className={`block text-sm ${
                            searchParams.category === category.slug
                              ? 'text-primary-600 font-medium'
                              : 'text-gray-600 hover:text-primary-600'
                          }`}
                        >
                          {category.name}
                        </a>
                      ))}
                      <a
                        href="/productos"
                        className={`block text-sm ${
                          !searchParams.category
                            ? 'text-primary-600 font-medium'
                            : 'text-gray-600 hover:text-primary-600'
                        }`}
                      >
                        Todos
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Material</h3>
                    <div className="space-y-2">
                      <a
                        href={`/productos?${new URLSearchParams({ ...searchParams, material: 'metallic' }).toString()}`}
                        className={`block text-sm ${
                          searchParams.material === 'metallic'
                            ? 'text-primary-600 font-medium'
                            : 'text-gray-600 hover:text-primary-600'
                        }`}
                      >
                        Metálicas
                      </a>
                      <a
                        href={`/productos?${new URLSearchParams({ ...searchParams, material: 'plastic' }).toString()}`}
                        className={`block text-sm ${
                          searchParams.material === 'plastic'
                            ? 'text-primary-600 font-medium'
                            : 'text-gray-600 hover:text-primary-600'
                        }`}
                      >
                        Plásticas
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Capacidad</h3>
                    <div className="space-y-2">
                      {['350ml', '500ml', '750ml', '1L'].map((cap) => (
                        <a
                          key={cap}
                          href={`/productos?${new URLSearchParams({ ...searchParams, capacity: cap }).toString()}`}
                          className={`block text-sm ${
                            searchParams.capacity === cap
                              ? 'text-primary-600 font-medium'
                              : 'text-gray-600 hover:text-primary-600'
                          }`}
                        >
                          {cap}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {products?.length || 0} productos encontrados
                </p>
                <SortSelect currentSort={searchParams.sort} />
              </div>

              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No se encontraron productos con los filtros seleccionados
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
