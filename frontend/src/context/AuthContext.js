import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // Check if email is confirmed
    if (data?.user && !data.user.email_confirmed_at) {
      setUser(null);
      setError('Please verify your email before logging in.');
      setLoading(false);
      return { data: null, error: { message: 'Please verify your email before logging in.' } };
    }
    setUser(data?.user || null);
    setError(error ? error.message : null);
    setLoading(false);
    return { data, error };
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    // Do not set user until email is confirmed
    setUser(null);
    setError(error ? error.message : null);
    setLoading(false);
    return { data, error };
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 