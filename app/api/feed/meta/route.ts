import { NextResponse } from 'next/server';
import { createUnauthenticatedClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createUnauthenticatedClient();

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .gt('stock', 0);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bottlestore.netlify.app';

    const feed = products?.map((product) => ({
      id: product.sku,
      title: product.name,
      description: product.short_description || product.description,
      availability: product.stock > 0 ? 'in stock' : 'out of stock',
      condition: 'new',
      price: `${(product.sale_price || product.price).toFixed(2)} ARS`,
      link: `${baseUrl}/productos/${product.slug}`,
      image_link: product.images?.[0] || '',
      brand: 'BottleStore',
      google_product_category: 'Home & Garden > Kitchen & Dining > Drinkware',
      product_type: product.material === 'metallic' ? 'Botellas Metálicas' : 'Botellas Plásticas',
      custom_label_0: product.capacity,
      custom_label_1: product.color,
      custom_label_2: product.material,
    })) || [];

    return NextResponse.json({
      data: feed,
      count: feed.length,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating feed:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
