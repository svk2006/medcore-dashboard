import { useState } from 'react';
import { useRealtimeAdmissions } from '@/hooks/useRealtimeAdmissions';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, Activity } from 'lucide-react';

const DEPARTMENTS = [
  'Emergency', 'Cardiology', 'Orthopaedics', 'Internal Medicine',
  'General Surgery', 'Nephrology', 'Gastroenterology', 'Pulmonology',
  'Family Medicine', 'Obstetrics & Gynecology',
];

const DOCTORS = [
  'Dr. Shawn Martin', 'Dr. Peter Novak', 'Dr. Sofia Kim', 'Dr. Priya Iyer',
  'Dr. Thomas Muller', 'Dr. Ahmed Zayed', 'Dr. Omar Khalid', 'Dr. Hana Suzuki',
  'Dr. Lily James', 'Dr. Aisha Rahman',
];

const Admissions = () => {
  const { admissions, addAdmission } = useRealtimeAdmissions();
  const { profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patient_name: '',
    department: '',
    severity: '1',
    doctor_name: '',
    case_type: 'IP',
  });

  // Filter admissions by department
  const visibleAdmissions = isAdmin ? admissions : admissions.filter(a => a.department === profile?.department);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient_name || !form.department || !form.doctor_name) return;

    setSubmitting(true);
    try {
      await addAdmission({
        patient_name: form.patient_name,
        department: form.department,
        severity: parseInt(form.severity),
        doctor_name: form.doctor_name,
        case_type: form.case_type,
      });

      toast({
        title: (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Admission Recorded
          </span>
        ) as unknown as string,
        description: `${form.patient_name} admitted to ${form.department} under ${form.doctor_name}`,
      });

      setForm({ patient_name: '', department: '', severity: '1', doctor_name: '', case_type: 'IP' });
    } catch {
      toast({ title: 'Error', description: 'Failed to record admission. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Admissions Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Live patient admission — updates dashboard in real-time</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient Name</Label>
              <Input value={form.patient_name} onChange={e => setForm(f => ({ ...f, patient_name: e.target.value }))} placeholder="Enter patient name" className="bg-secondary border-border" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</Label>
              <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Severity Level</Label>
              <Select value={form.severity} onValueChange={v => setForm(f => ({ ...f, severity: v }))}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="1">Level 1 — Low</SelectItem>
                  <SelectItem value="2">Level 2 — Moderate</SelectItem>
                  <SelectItem value="3">Level 3 — High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Attending Doctor</Label>
              <Select value={form.doctor_name} onValueChange={v => setForm(f => ({ ...f, doctor_name: v }))}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {DOCTORS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Case Type</Label>
              <Select value={form.case_type} onValueChange={v => setForm(f => ({ ...f, case_type: v }))}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="IP">Inpatient (IP)</SelectItem>
                  <SelectItem value="OP">Outpatient (OP)</SelectItem>
                  <SelectItem value="DC">Day Case (DC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={submitting || !form.patient_name || !form.department || !form.doctor_name} className="w-full sm:w-auto">
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Recording…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Record Admission
              </span>
            )}
          </Button>
        </form>

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Recent Live Admissions
            <span className="ml-auto flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </h3>

          {visibleAdmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No live admissions yet.</p>
          ) : (
            <div className="space-y-2">
              {visibleAdmissions.slice(0, 10).map(a => (
                <div key={a.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-secondary/50 px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${a.severity >= 3 ? 'bg-destructive' : a.severity >= 2 ? 'bg-warning' : 'bg-success'}`} />
                    <span className="font-medium text-foreground">{a.patient_name}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-5 sm:ml-0">
                    <span className="text-muted-foreground text-xs">{a.department}</span>
                    <span className="text-muted-foreground text-xs hidden sm:inline">{a.doctor_name}</span>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{a.case_type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admissions;
