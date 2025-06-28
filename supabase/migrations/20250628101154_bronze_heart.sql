/*
  # Create budget data table

  1. New Tables
    - `budget_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text)
      - `subcategory` (text, nullable)
      - `type` (text) - income, needs, wants, savings
      - `budget_amount` (numeric)
      - `actual_amount` (numeric)
      - `payday` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `budget_data` table
    - Add policies for users to manage their own budget data
*/

CREATE TABLE IF NOT EXISTS budget_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  subcategory text,
  type text NOT NULL CHECK (type IN ('income', 'needs', 'wants', 'savings')),
  budget_amount numeric DEFAULT 0,
  actual_amount numeric DEFAULT 0,
  payday text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budget_data ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own budget data
CREATE POLICY "Users can read own budget data"
  ON budget_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own budget data
CREATE POLICY "Users can insert own budget data"
  ON budget_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own budget data
CREATE POLICY "Users can update own budget data"
  ON budget_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete their own budget data
CREATE POLICY "Users can delete own budget data"
  ON budget_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_budget_data_updated_at
  BEFORE UPDATE ON budget_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();