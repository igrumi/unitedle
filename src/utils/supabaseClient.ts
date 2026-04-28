import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno para no exponer tus llaves en el código
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno de Supabase. Revisa tu archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);