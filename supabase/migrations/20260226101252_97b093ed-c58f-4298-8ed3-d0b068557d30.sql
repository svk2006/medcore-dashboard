
DROP POLICY "Allow all access" ON public.live_admissions;

-- Public read access for dashboard display
CREATE POLICY "Allow public read" ON public.live_admissions
  FOR SELECT USING (true);

-- Public insert only (demo mode - no auth required for form submission)
CREATE POLICY "Allow public insert" ON public.live_admissions
  FOR INSERT WITH CHECK (true);

-- Add constraints for data integrity
ALTER TABLE public.live_admissions
  ADD CONSTRAINT severity_range CHECK (severity >= 1 AND severity <= 3),
  ADD CONSTRAINT patient_name_length CHECK (char_length(patient_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT doctor_name_length CHECK (char_length(doctor_name) BETWEEN 1 AND 100),
  ADD CONSTRAINT department_valid CHECK (department IN ('Emergency', 'Cardiology', 'Orthopaedics', 'Internal Medicine', 'General Surgery', 'Nephrology', 'Gastroenterology', 'Pulmonology', 'Family Medicine', 'Obstetrics & Gynecology')),
  ADD CONSTRAINT case_type_valid CHECK (case_type IN ('IP', 'OP', 'DC'));
