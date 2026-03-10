import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://lkrpzqpcmdlnjmloaryj.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcnB6cXBjbWRsbmptbG9hcnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NzEzNzUsImV4cCI6MjA3NjE0NzM3NX0.rLRdK3m0SE4FEKLKcdokSFaknDv-XZ-P4AQiVCK2_7s",
);
