/*
  # Add customer_identification column to orders table

  1. Changes
    - Add `customer_identification` column to `orders` table
      - Type: text (stores DNI or identification number)
      - Nullable to maintain compatibility with existing orders
  
  2. Purpose
    - Required by MercadoPago API for payment processing
    - Stores customer's DNI/identification document
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_identification'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_identification text;
  END IF;
END $$;