import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno de Supabase. Revisa tu archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInWithDiscord = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: window.location.origin, 
    },
  });
  if (error) console.error("Error Discord Login:", error.message);
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
