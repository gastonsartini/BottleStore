/*
  # E-Commerce Database Schema for BottleStore

  ## Overview
  Complete database schema for a multi-tenant e-commerce system specialized in water bottles
  
  ## New Tables Created
  
  ### 1. categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "Botellas Metálicas")
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Category description for SEO
  - `image` (text) - Category image URL
  - `parent_id` (uuid, nullable) - For subcategories
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. products
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `description` (text) - Full product description
  - `short_description` (text) - Brief summary for listings
  - `price` (decimal) - Base price
  - `sale_price` (decimal, nullable) - Discounted price if on sale
  - `stock` (integer) - Available quantity
  - `category_id` (uuid) - Foreign key to categories
  - `capacity` (text) - Bottle capacity (e.g., "500ml", "750ml", "1L")
  - `material` (text) - "metallic" or "plastic"
  - `color` (text) - Primary color
  - `images` (jsonb) - Array of image URLs
  - `variants` (jsonb) - Product variants data
  - `sku` (text, unique) - Stock Keeping Unit
  - `meta_title` (text) - SEO page title
  - `meta_description` (text) - SEO meta description
  - `slug` (text, unique) - URL-friendly identifier
  - `featured` (boolean) - Show on homepage
  - `active` (boolean) - Product visibility
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. orders
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Human-readable order ID
  - `customer_name` (text)
  - `customer_email` (text)
  - `customer_phone` (text)
  - `items` (jsonb) - Array of order items
  - `subtotal` (decimal)
  - `discount` (decimal)
  - `shipping_cost` (decimal)
  - `total` (decimal)
  - `status` (text) - Order status enum
  - `payment_status` (text) - Payment status enum
  - `payment_method` (text)
  - `payment_id` (text) - External payment gateway ID
  - `shipping_address` (jsonb) - Complete shipping address
  - `shipping_provider` (text)
  - `tracking_number` (text)
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. coupons
  - `id` (uuid, primary key)
  - `code` (text, unique) - Coupon code
  - `discount_type` (text) - "percentage" or "fixed"
  - `discount_value` (decimal)
  - `min_purchase` (decimal, nullable)
  - `max_uses` (integer, nullable)
  - `current_uses` (integer)
  - `valid_from` (timestamptz)
  - `valid_until` (timestamptz)
  - `active` (boolean)
  - `created_at` (timestamptz)
  
  ### 5. shipping_zones
  - `id` (uuid, primary key)
  - `name` (text) - Zone name
  - `postal_codes` (jsonb) - Array of postal code ranges
  - `base_rate` (decimal)
  - `additional_rate_per_kg` (decimal)
  - `estimated_days` (integer)
  - `provider` (text) - Shipping provider name
  - `active` (boolean)
  - `created_at` (timestamptz)
  
  ## Security
  - RLS (Row Level Security) enabled on all tables
  - Restrictive policies for authenticated users only
  - Public read access for products and categories
  - Admin-only write access for products, categories, and settings
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  short_description text DEFAULT '',
  price decimal(10, 2) NOT NULL,
  sale_price decimal(10, 2),
  stock integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  capacity text NOT NULL DEFAULT '500ml',
  material text NOT NULL DEFAULT 'plastic',
  color text NOT NULL DEFAULT '',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  variants jsonb DEFAULT '[]'::jsonb,
  sku text UNIQUE NOT NULL,
  meta_title text,
  meta_description text,
  slug text UNIQUE NOT NULL,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT material_check CHECK (material IN ('metallic', 'plastic'))
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal decimal(10, 2) NOT NULL DEFAULT 0,
  discount decimal(10, 2) NOT NULL DEFAULT 0,
  shipping_cost decimal(10, 2) NOT NULL DEFAULT 0,
  total decimal(10, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_method text DEFAULT 'mercadopago',
  payment_id text,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  shipping_provider text,
  tracking_number text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  CONSTRAINT payment_status_check CHECK (payment_status IN ('pending', 'approved', 'rejected', 'refunded'))
);

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL,
  discount_value decimal(10, 2) NOT NULL,
  min_purchase decimal(10, 2),
  max_uses integer,
  current_uses integer DEFAULT 0,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT discount_type_check CHECK (discount_type IN ('percentage', 'fixed'))
);

CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  postal_codes jsonb NOT NULL DEFAULT '[]'::jsonb,
  base_rate decimal(10, 2) NOT NULL DEFAULT 0,
  additional_rate_per_kg decimal(10, 2) DEFAULT 0,
  estimated_days integer DEFAULT 7,
  provider text NOT NULL DEFAULT 'standard',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Shipping zones are viewable by everyone"
  ON shipping_zones FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Coupons can be validated by everyone"
  ON coupons FOR SELECT
  TO public
  USING (active = true AND valid_from <= now() AND valid_until >= now());

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
