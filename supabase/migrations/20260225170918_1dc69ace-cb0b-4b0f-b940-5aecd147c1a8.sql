
-- Create live admissions table
CREATE TABLE public.live_admissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  department TEXT NOT NULL,
  severity INTEGER NOT NULL DEFAULT 1,
  doctor_name TEXT NOT NULL,
  case_type TEXT NOT NULL DEFAULT 'IP',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_admissions;

-- Enable replica identity for realtime
ALTER TABLE public.live_admissions REPLICA IDENTITY FULL;

-- No RLS needed - public dashboard
ALTER TABLE public.live_admissions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon (no auth required for demo)
CREATE POLICY "Allow all access" ON public.live_admissions FOR ALL USING (true) WITH CHECK (true);
