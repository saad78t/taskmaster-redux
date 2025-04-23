import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://sbpcuubxhhdcznergrlo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicGN1dWJ4aGhkY3puZXJncmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEwNjEsImV4cCI6MjA1OTk1NzA2MX0.KC5obvJBazUjZTYdyRSMVekPmRIYkk9uXOzjj0b7EGk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
