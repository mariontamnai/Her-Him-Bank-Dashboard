import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wzhqfnnjzyovmbbqmeuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aHFmbm5qenlvdm1iYnFtZXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDAyODEsImV4cCI6MjA4ODkxNjI4MX0.cSsZJy99846xWeCu9qHS2NMRqRKxrKdj91cV22lYw4U';

export const supabase = createClient(supabaseUrl, supabaseKey);