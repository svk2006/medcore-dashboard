import { useMemo } from 'react';
import { useHospitalData } from '@/hooks/useHospitalData';
import { calculateALOS, calculateCMI, getWorkloadByDepartment, getRevenueByMonth, getPayerDistribution, getSeverityDistribution } from '@/lib/parseHospitalData';
import DashboardLayout from '@/components/DashboardLayout';
import MetricCard from '@/components/MetricCard';
import EKGLoader from '@/components/EKGLoader';
import { Activity, Clock, DollarSign, Users, Stethoscope, Heart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = [
  'hsl(207 90% 54%)',
  'hsl(172 66% 50%)',
  'hsl(262 83% 58%)',
  'hsl(38 92% 50%)',
  'hsl(0 72% 51%)',
];

const Index = () => {
  const { data, loading } = useHospitalData();

  const metrics = useMemo(() => {
    if (data.length === 0) return null;
    return {
      alos: calculateALOS(data),
      cmi: calculateCMI(data),
      workload: getWorkloadByDepartment(data),
      revenue: getRevenueByMonth(data),
      totalRevenue: data.reduce((s, r) => s + r.revenue, 0),
      totalCases: data.length,
      payer: getPayerDistribution(data),
      severity: getSeverityDistribution(data),
    };
  }, [data]);

  if (loading || !metrics) return <EKGLoader />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time clinical performance metrics</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="ALOS (Days)" value={metrics.alos.toFixed(2)} subtitle="Inpatient & Day Case" icon={Clock} delay={100} />
          <MetricCard title="Case Mix Index" value={metrics.cmi.toFixed(3)} subtitle="Avg complexity score" icon={Activity} delay={200} />
          <MetricCard title="Total Cases" value={metrics.totalCases.toLocaleString()} subtitle="All case types" icon={Users} delay={300} />
          <MetricCard title="Total Revenue" value={`$${(metrics.totalRevenue / 1000000).toFixed(1)}M`} subtitle="Across all departments" icon={DollarSign} delay={400} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Workload Chart */}
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Workload: Doctors vs Patients by Department
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.workload} margin={{ top: 5, right: 5, bottom: 60, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 25% 16%)" />
                <XAxis dataKey="department" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }} angle={-45} textAnchor="end" />
                <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(222 44% 9%)', border: '1px solid hsl(222 25% 16%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }}
                />
                <Bar dataKey="patients" name="Patients" fill="hsl(207 90% 54%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="doctors" name="Doctors" fill="hsl(172 66% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Monthly Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.revenue} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(207 90% 54%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(207 90% 54%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 25% 16%)" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(222 44% 9%)', border: '1px solid hsl(222 25% 16%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(207 90% 54%)" fill="url(#revGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Payer Mix */}
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Payer Mix
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={metrics.payer} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                  {metrics.payer.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222 44% 9%)', border: '1px solid hsl(222 25% 16%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {metrics.payer.map((p, i) => (
                <div key={p.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metrics.severity} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 25% 16%)" />
                <XAxis type="number" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                <YAxis type="category" dataKey="severity" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222 44% 9%)', border: '1px solid hsl(222 25% 16%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }} />
                <Bar dataKey="count" fill="hsl(262 83% 58%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Doctors */}
          <div className="rounded-xl border border-border bg-card p-5 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Top Doctors by Caseload</h3>
            <div className="space-y-3">
              {(() => {
                const doctorMap = new Map<string, number>();
                data.forEach(r => doctorMap.set(r.doctorName, (doctorMap.get(r.doctorName) || 0) + 1));
                return Array.from(doctorMap.entries())
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([name, count], i) => {
                    const max = Array.from(doctorMap.values()).sort((a, b) => b - a)[0];
                    return (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium">{name}</span>
                          <span className="text-muted-foreground">{count} cases</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${(count / max) * 100}%`,
                              backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                              animationDelay: `${1000 + i * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
