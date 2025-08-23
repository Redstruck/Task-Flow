import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TodoList, TaskTemplate, AppSettings, CalendarEvent } from '../types';

export interface UserData {
  lists: TodoList[];
  templates: TaskTemplate[];
  settings: AppSettings;
  calendarEvents: CalendarEvent[];
}

export const useSupabaseData = (userId: string | null) => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data from Supabase
  const loadUserData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: userData, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (userData) {
        setData({
          lists: userData.lists || [],
          templates: userData.templates || [],
          settings: userData.settings || null,
          calendarEvents: userData.calendar_events || [],
        });
      } else {
        // No data found, initialize with defaults
        setData({
          lists: [],
          templates: [],
          settings: null,
          calendarEvents: [],
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Save user data to Supabase
  const saveUserData = async (userData: Partial<UserData>) => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          lists: userData.lists,
          templates: userData.templates,
          settings: userData.settings,
          calendar_events: userData.calendarEvents,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error saving user data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save data' 
      };
    }
  };

  // Load data when userId changes
  useEffect(() => {
    if (userId) {
      loadUserData();
    } else {
      setData(null);
    }
  }, [userId]);

  return {
    data,
    loading,
    error,
    saveUserData,
    reloadData: loadUserData,
  };
};