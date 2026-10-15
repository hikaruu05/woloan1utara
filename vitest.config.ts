import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  define: { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://supabase.example.test'), 'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('local-test-key') },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'], include: ['tests/**/*.test.{ts,tsx}'], restoreMocks: true },
});
