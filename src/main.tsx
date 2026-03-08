import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgkpnbliyqcqtcniugubu.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impna3BuYmxpeWNxdGNuaXVndWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MzMzMzUsImV4cCI6MjA4ODUwOTMzNX0.Omv4Qx3LjODRS9Fwoe_b0ly36eIZZ17FysSsnY7QGkI'

export const supabase = createClient(supabaseUrl, supabaseKey)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
