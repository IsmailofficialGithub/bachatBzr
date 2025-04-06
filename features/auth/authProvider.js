// src/components/AuthInitializer.jsx
'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuthSession, updateAuthState } from '@/features/auth/authSlice';
import { supabase } from '@/lib/supabase';

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      
      // Initial auth check - only runs once
      dispatch(fetchAuthSession());
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        dispatch(updateAuthState({
          session,
          user: session?.user || null
        }));
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}