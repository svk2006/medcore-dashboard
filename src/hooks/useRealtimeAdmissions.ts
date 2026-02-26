import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const DEPARTMENTS = [
  'Emergency', 'Cardiology', 'Orthopaedics', 'Internal Medicine',
  'General Surgery', 'Nephrology', 'Gastroenterology', 'Pulmonology',
  'Family Medicine', 'Obstetrics & Gynecology',
] as const;

const CASE_TYPES = ['IP', 'OP', 'DC'] as const;

export const AdmissionSchema = z.object({
  patient_name: z.string().trim().min(1, 'Patient name is required').max(100, 'Patient name too long'),
  department: z.enum(DEPARTMENTS, { errorMap: () => ({ message: 'Invalid department' }) }),
  severity: z.number().int().min(1).max(3),
  doctor_name: z.string().trim().min(1, 'Doctor name is required').max(100, 'Doctor name too long'),
  case_type: z.enum(CASE_TYPES, { errorMap: () => ({ message: 'Invalid case type' }) }),
});

export type AdmissionInput = z.infer<typeof AdmissionSchema>;

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
    // Validate input before database insertion
    const parsed = AdmissionSchema.parse(admission);

    const { error } = await supabase
      .from('live_admissions')
      .insert({
        patient_name: parsed.patient_name,
        department: parsed.department,
        severity: parsed.severity,
        doctor_name: parsed.doctor_name,
        case_type: parsed.case_type,
      });

    if (error) throw error;
  }, []);

  return { admissions, loading, addAdmission };
}
