import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveAdmission {
  id: string;
  patient_name: string;
  department: string;
  severity: number;
  doctor_name: string;
  case_type: string;
  created_at: string;
}

export function useRealtimeAdmissions() {
  const [admissions, setAdmissions] = useState<LiveAdmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchAdmissions = async () => {
      const { data, error } = await supabase
        .from('live_admissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAdmissions(data as LiveAdmission[]);
      }
      setLoading(false);
    };

    fetchAdmissions();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('live_admissions_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_admissions' },
        (payload) => {
          setAdmissions(prev => [payload.new as LiveAdmission, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'live_admissions' },
        (payload) => {
          setAdmissions(prev => prev.filter(a => a.id !== (payload.old as LiveAdmission).id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addAdmission = useCallback(async (admission: Omit<LiveAdmission, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('live_admissions')
      .insert(admission);

    if (error) throw error;
  }, []);

  return { admissions, loading, addAdmission };
}
