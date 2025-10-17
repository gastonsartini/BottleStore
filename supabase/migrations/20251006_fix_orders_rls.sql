/*
  # Fix Orders RLS Policy

  ## Changes
  - Drop existing "Anyone can create orders" policy
  - Create new policy that allows anonymous (anon) users to create orders
  - This enables guest checkout functionality
*/

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

CREATE POLICY "Anonymous users can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);
