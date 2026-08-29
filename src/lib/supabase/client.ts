import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifdkizciatxizzbplqbp.supabase.co';
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZGtpemNpYXR4aXp6YnBscWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NTkxNjksImV4cCI6MjEwMzUzNTE2OX0.Dnhp-0SnWPKf8D9RvlfxZeN0zjG7gyFCXctAAJaQ_9I';

  return createBrowserClient(url, key);
}
