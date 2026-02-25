import { useMemo } from 'react';
import { useHospitalData } from '@/hooks/useHospitalData';
import DashboardLayout from '@/components/DashboardLayout';
import EKGLoader from '@/components/EKGLoader';
import { AlertTriangle, CheckCircle2, Clock, UserX } from 'lucide-react';

const Resolution = () => {
  const { data, loading } = useHospitalData();

  const issues = useMemo(() => {
    if (data.length === 0) return [];

    const items: { type: 'warning' | 'critical' | 'info'; title: string; description: string; icon: typeof AlertTriangle }[] = [];

    // Inactive doctors with cases
    const inactiveDoctors = [...new Set(data.filter(r => r.doctorStatus === 'Inactive').map(r => r.doctorName))];
    if (inactiveDoctors.length > 0) {
      items.push({
        type: 'critical',
        title: `${inactiveDoctors.length} Inactive Doctor(s) with Assigned Cases`,
        description: `Doctors: ${inactiveDoctors.join(', ')}. Cases assigned to inactive physicians require reassignment.`,
        icon: UserX,
      });
    }

    // High severity cases
    const highSev = data.filter(r => r.severity >= 3);
    if (highSev.length > 0) {
      items.push({
        type: 'warning',
        title: `${highSev.length} High Severity Cases (Level 3)`,
        description: 'These cases require elevated monitoring and resource allocation.',
        icon: AlertTriangle,
      });
    }

    // Late discharges
    const lateDischarges = data.filter(r => r.dischargeBefore12PM === 'No');
    items.push({
      type: 'info',
      title: `${lateDischarges.length} Late Discharges (After 12 PM)`,
      description: 'Optimizing discharge timing can improve bed turnover rates.',
      icon: Clock,
    });

    // Long LOS outliers (>5 days)
    const longStay = data.filter(r => r.los > 5);
    if (longStay.length > 0) {
      items.push({
        type: 'warning',
        title: `${longStay.length} Extended Stay Cases (>5 Days)`,
        description: 'Review for potential discharge planning improvements.',
        icon: Clock,
      });
    }

    // Resolved: low CMI efficiency
    items.push({
      type: 'info',
      title: 'CMI Benchmarking Complete',
      description: `Average CMI across all cases is ${(data.reduce((s, r) => s + r.cmiValue, 0) / data.length).toFixed(3)}. Within acceptable range.`,
      icon: CheckCircle2,
    });

    return items;
  }, [data]);

  if (loading) return <EKGLoader />;

  const colorMap = {
    critical: { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive' },
    warning: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' },
    info: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary' },
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Resolution Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Operational flags and action items</p>
        </div>

        <div className="space-y-3">
          {issues.map((issue, i) => {
            const colors = colorMap[issue.type];
            return (
              <div
                key={i}
                className={`rounded-xl border ${colors.border} ${colors.bg} p-5 animate-fade-in-up`}
                style={{ animationDelay: `${i * 100 + 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}>
                    <issue.icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                  </div>
                  <span className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors.text} ${colors.bg} border ${colors.border}`}>
                    {issue.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Resolution;
