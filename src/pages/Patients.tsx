import { useState, useMemo } from 'react';
import { useRealtimeAdmissions } from '@/hooks/useRealtimeAdmissions';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import EKGLoader from '@/components/EKGLoader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const CASE_LABELS: Record<string, string> = { IP: 'Inpatient', OP: 'Outpatient', DC: 'Day Case' };
const SEVERITY_LABELS: Record<number, string> = { 1: 'Low', 2: 'Moderate', 3: 'High' };
const PAGE_SIZE = 10;

type SortKey = 'patient_name' | 'department' | 'severity' | 'created_at';
type SortDir = 'asc' | 'desc';

const Patients = () => {
  const { admissions, loading } = useRealtimeAdmissions();
  const { profile, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let rows = admissions;

    // Department filter (RLS handles this server-side, but also filter client-side for CSV data)
    if (!isAdmin && profile?.department) {
      rows = rows.filter(r => r.department === profile.department);
    }

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r => r.patient_name.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      rows = rows.filter(r => r.case_type === statusFilter);
    }

    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'patient_name') cmp = a.patient_name.localeCompare(b.patient_name);
      else if (sortKey === 'department') cmp = a.department.localeCompare(b.department);
      else if (sortKey === 'severity') cmp = a.severity - b.severity;
      else cmp = a.created_at.localeCompare(b.created_at);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return rows;
  }, [admissions, search, statusFilter, sortKey, sortDir, isAdmin, profile]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (loading) return <EKGLoader />;

  const SortHeader = ({ label, col }: { label: string; col: SortKey }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortKey === col ? 'text-primary' : ''}`} />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient List</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live admissions data {!isAdmin && profile ? `— ${profile.department}` : '— All Departments'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patient name…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="bg-secondary border-border pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-44 bg-secondary border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IP">Inpatient</SelectItem>
              <SelectItem value="OP">Outpatient</SelectItem>
              <SelectItem value="DC">Day Case</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><SortHeader label="Patient Name" col="patient_name" /></TableHead>
                <TableHead className="hidden sm:table-cell"><SortHeader label="Department" col="department" /></TableHead>
                <TableHead><SortHeader label="Severity" col="severity" /></TableHead>
                <TableHead className="hidden md:table-cell">Doctor</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead><SortHeader label="Admitted" col="created_at" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium text-foreground">{row.patient_name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{row.department}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        row.severity >= 3 ? 'bg-destructive/10 text-destructive'
                          : row.severity >= 2 ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          row.severity >= 3 ? 'bg-destructive' : row.severity >= 2 ? 'bg-warning' : 'bg-success'
                        }`} />
                        {SEVERITY_LABELS[row.severity] || row.severity}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{row.doctor_name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {CASE_LABELS[row.case_type] || row.case_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(row.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {filtered.length} patient{filtered.length !== 1 ? 's' : ''} · Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
