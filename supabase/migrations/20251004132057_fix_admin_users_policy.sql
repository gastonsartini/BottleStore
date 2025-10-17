/*
  # Fix Admin Users RLS Policy

  1. Changes
    - Add INSERT policy for admin_users table to allow user creation
    - This policy allows inserting when the user is being created (authenticated or not)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read admin users" ON admin_users;

-- Allow anyone to insert (needed for signup)
CREATE POLICY "Allow insert for new admin users"
  ON admin_users FOR INSERT
  WITH CHECK (true);

-- Authenticated users can read admin users
CREATE POLICY "Authenticated users can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);
