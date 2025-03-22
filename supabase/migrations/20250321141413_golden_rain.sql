/*
  # Game Schema Setup

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `host_id` (uuid)
      - `created_at` (timestamp)
      - `game_started` (boolean)
      - `winner_id` (uuid, nullable)
    
    - `players`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key)
      - `name` (text)
      - `position` (integer)
      - `color` (text)
      - `created_at` (timestamp)
      - `current_turn` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  host_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  game_started boolean DEFAULT false,
  winner_id uuid REFERENCES auth.users(id),
  CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES auth.users(id)
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  position integer DEFAULT 0,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  current_turn boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Anyone can create a room"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Players can view their rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT room_id 
      FROM players 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Host can update room"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

-- Policies for players
CREATE POLICY "Players can view other players in their room"
  ON players
  FOR SELECT
  TO authenticated
  USING (
    room_id IN (
      SELECT room_id 
      FROM players 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Players can join rooms"
  ON players
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Players can update their own data"
  ON players
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());