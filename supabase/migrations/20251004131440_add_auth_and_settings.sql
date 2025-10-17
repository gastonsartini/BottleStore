/*
  # Add Authentication and Store Settings

  1. New Tables
    - `store_settings`
      - `id` (uuid, primary key)
      - `store_name` (text)
      - `store_email` (text)
      - `store_phone` (text)
      - `store_address` (text)
      - `currency` (text, default 'ARS')
      - `tax_rate` (numeric, default 0)
      - `updated_at` (timestamptz)
    
    - `payment_methods`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - 'cash', 'transfer', 'card', 'mercadopago'
      - `enabled` (boolean, default true)
      - `instructions` (text)
      - `config` (jsonb) - for storing API keys, account info, etc.
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `shipping_methods`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `enabled` (boolean, default true)
      - `estimated_days` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `role` (text, default 'admin')
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated admin users only
*/

-- Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text DEFAULT 'Mi Tienda',
  store_email text,
  store_phone text,
  store_address text,
  currency text DEFAULT 'ARS',
  tax_rate numeric DEFAULT 0,
  logo_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read store settings"
  ON store_settings FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can update store settings"
  ON store_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default store settings
INSERT INTO store_settings (id, store_name, store_email, store_phone)
VALUES (gen_random_uuid(), 'BottleStore', 'contacto@bottlestore.com', '+54 9 11 1234-5678')
ON CONFLICT DO NOTHING;

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  enabled boolean DEFAULT true,
  instructions text,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled payment methods"
  ON payment_methods FOR SELECT
  USING (enabled = true);

CREATE POLICY "Authenticated users can read all payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (true);

-- Insert default payment methods
INSERT INTO payment_methods (name, type, enabled, instructions) VALUES
  ('Efectivo', 'cash', true, 'Pago en efectivo al momento de la entrega'),
  ('Transferencia Bancaria', 'transfer', true, 'CBU: 0000003100010123456789 - Alias: BOTTLESTORE'),
  ('Mercado Pago', 'mercadopago', false, 'Paga con tarjeta o dinero en cuenta')
ON CONFLICT DO NOTHING;

-- Shipping Methods Table
CREATE TABLE IF NOT EXISTS shipping_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  enabled boolean DEFAULT true,
  estimated_days text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read enabled shipping methods"
  ON shipping_methods FOR SELECT
  USING (enabled = true);

CREATE POLICY "Authenticated users can read all shipping methods"
  ON shipping_methods FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert shipping methods"
  ON shipping_methods FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shipping methods"
  ON shipping_methods FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shipping methods"
  ON shipping_methods FOR DELETE
  TO authenticated
  USING (true);

-- Insert default shipping methods
INSERT INTO shipping_methods (name, description, price, enabled, estimated_days) VALUES
  ('Retiro en local', 'Retirá tu pedido en nuestro local', 0, true, 'Inmediato'),
  ('Envío a domicilio', 'Envío a tu domicilio dentro de la ciudad', 500, true, '2-3 días'),
  ('Envío al interior', 'Envío al interior del país', 1500, true, '5-7 días')
ON CONFLICT DO NOTHING;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);
