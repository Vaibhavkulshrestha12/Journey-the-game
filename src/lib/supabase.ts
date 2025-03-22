import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createRoom(hostId: string): Promise<string> {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const { error } = await supabase
    .from('rooms')
    .insert([
      { code, host_id: hostId }
    ]);

  if (error) throw error;
  return code;
}

export async function joinRoom(code: string, userId: string, playerName: string, color: string) {
  // Get room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id, game_started')
    .eq('code', code)
    .single();

  if (roomError) throw roomError;
  if (!room) throw new Error('Room not found');
  if (room.game_started) throw new Error('Game already started');

  // Join room
  const { error: playerError } = await supabase
    .from('players')
    .insert([
      {
        room_id: room.id,
        user_id: userId,
        name: playerName,
        color,
        current_turn: false
      }
    ]);

  if (playerError) throw playerError;
  return room;
}

export async function startGame(roomId: string) {
  const { error } = await supabase
    .from('rooms')
    .update({ game_started: true })
    .eq('id', roomId);

  if (error) throw error;

  // Set first player's turn
  const { data: players } = await supabase
    .from('players')
    .select('id')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (players && players.length > 0) {
    await supabase
      .from('players')
      .update({ current_turn: true })
      .eq('id', players[0].id);
  }
}

export async function updatePlayerPosition(playerId: string, position: number) {
  const { error } = await supabase
    .from('players')
    .update({ position })
    .eq('id', playerId);

  if (error) throw error;
}

export async function setWinner(roomId: string, playerId: string) {
  const { error } = await supabase
    .from('rooms')
    .update({ winner_id: playerId })
    .eq('id', roomId);

  if (error) throw error;
}

export async function nextTurn(roomId: string, currentPlayerId: string) {
  // Get all players in room
  const { data: players } = await supabase
    .from('players')
    .select('id')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (!players) return;

  // Find current player index
  const currentIndex = players.findIndex(p => p.id === currentPlayerId);
  const nextIndex = (currentIndex + 1) % players.length;

  // Update turns
  await supabase
    .from('players')
    .update({ current_turn: false })
    .eq('id', currentPlayerId);

  await supabase
    .from('players')
    .update({ current_turn: true })
    .eq('id', players[nextIndex].id);
}