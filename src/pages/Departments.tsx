import { useMemo, useState } from 'react';
import { useHospitalData } from '@/hooks/useHospitalData';
import { getDepartmentTrends, calculateALOS, calculateCMI } from '@/lib/parseHospitalData';
import DashboardLayout from '@/components/DashboardLayout';
import EKGLoader from '@/components/EKGLoader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Departments = () => {
  const { data, loading } = useHospitalData();
  const [selectedDept, setSelectedDept] = useState<string>('');

  const departments = useMemo(() => {
    const depts = [...new Set(data.map(r => r.specialty))].sort();
    if (depts.length > 0 && !selectedDept) setSelectedDept(depts[0]);
    return depts;
  }, [data]);

  const deptData = useMemo(() => {
    if (!selectedDept || data.length === 0) return null;
    const filtered = data.filter(r => r.specialty === selectedDept);
    const trends = getDepartmentTrends(filtered);
    const monthData = trends.get(selectedDept);
    if (!monthData) return null;

    const trendArray = Array.from(monthData.entries())
      .map(([month, d]) => ({
        month: month.slice(5, 7) + '/' + month.slice(2, 4),
        cases: d.cases,
        revenue: Math.round(d.revenue),
        alos: d.ipCases > 0 ? +(d.totalLOS / d.ipCases).toFixed(2) : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      trends: trendArray,
      alos: calculateALOS(filtered),
      cmi: calculateCMI(filtered),
      totalCases: filtered.length,
      totalRevenue: filtered.reduce((s, r) => s + r.revenue, 0),
      doctors: [...new Set(filtered.map(r => r.doctorName))],
    };
  }, [data, selectedDept]);

  if (loading) return <EKGLoader />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Departmental Trends</h1>
            <p className="text-sm text-muted-foreground mt-1">Performance analysis by specialty</p>
          </div>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-56 bg-card border-border">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {departments.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {deptData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {[
                { label: 'ALOS', value: deptData.alos.toFixed(2) + ' days' },
                { label: 'CMI', value: deptData.cmi.toFixed(3) },
                { label: 'Total Cases', value: deptData.totalCases.toLocaleString() },
                { label: 'Revenue', value: `$${(deptData.totalRevenue / 1000).toFixed(0)}k` },
              ].map(m => (
                <div key={m.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Case Volume</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={deptData.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 25% 16%)" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222 44% 9%)', border: '1px solid hsl(222 25% 16%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }} />
                    <Bar dataKey="cases" fill="hsl(207 90% 54%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">ALOS Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={deptData.trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 25% 16%)" />
                    <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(222 44% 9%)', border: '1px solid hsl(222 25% 16%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }} />
                    <Line type="monotone" dataKey="alos" stroke="hsl(172 66% 50%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(172 66% 50%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Doctors */}
            <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-sm font-semibold text-foreground mb-3">Assigned Physicians ({deptData.doctors.length})</h3>
              <div className="flex flex-wrap gap-2">
                {deptData.doctors.map(d => (
                  <span key={d} className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">{d}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Departments;
