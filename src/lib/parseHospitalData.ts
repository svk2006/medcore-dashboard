export interface HospitalRecord {
  month: string;
  caseNo: string;
  dob: number;
  nationality: string;
  gender: string;
  doctorLicense: string;
  doctorName: string;
  doctorType: string;
  doctorStatus: string;
  cmiValue: number;
  specialty: string;
  insurancePayer: string;
  insurancePlanName: string;
  payerMix: string;
  caseType: string;
  los: number;
  severity: number;
  surgicalMix: string;
  dischargeTime: string;
  dischargeBefore12PM: string;
  revenue: number;
}

export function parseCSV(csvText: string): HospitalRecord[] {
  const lines = csvText.trim().split('\n');
  const records: HospitalRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 21) continue;

    records.push({
      month: cols[0],
      caseNo: cols[1],
      dob: parseFloat(cols[2]) || 0,
      nationality: cols[3],
      gender: cols[4],
      doctorLicense: cols[5],
      doctorName: cols[6],
      doctorType: cols[7],
      doctorStatus: cols[8],
      cmiValue: parseFloat(cols[9]) || 0,
      specialty: cols[10],
      insurancePayer: cols[11],
      insurancePlanName: cols[12],
      payerMix: cols[13],
      caseType: cols[14],
      los: parseFloat(cols[15]) || 0,
      severity: parseFloat(cols[16]) || 0,
      surgicalMix: cols[17],
      dischargeTime: cols[18],
      dischargeBefore12PM: cols[19],
      revenue: parseFloat(cols[20]) || 0,
    });
  }

  return records;
}

export function calculateALOS(records: HospitalRecord[]): number {
  const ipRecords = records.filter(r => r.caseType === 'IP' || r.caseType === 'DC');
  if (ipRecords.length === 0) return 0;
  const totalLOS = ipRecords.reduce((sum, r) => sum + r.los, 0);
  return totalLOS / ipRecords.length;
}

export function calculateCMI(records: HospitalRecord[]): number {
  if (records.length === 0) return 0;
  const totalCMI = records.reduce((sum, r) => sum + r.cmiValue, 0);
  return totalCMI / records.length;
}

export function getWorkloadByDepartment(records: HospitalRecord[]) {
  const deptMap = new Map<string, { patients: number; doctors: Set<string> }>();

  for (const r of records) {
    if (!deptMap.has(r.specialty)) {
      deptMap.set(r.specialty, { patients: 0, doctors: new Set() });
    }
    const dept = deptMap.get(r.specialty)!;
    dept.patients++;
    dept.doctors.add(r.doctorName);
  }

  return Array.from(deptMap.entries())
    .map(([name, data]) => ({
      department: name.length > 15 ? name.slice(0, 13) + '…' : name,
      fullName: name,
      patients: data.patients,
      doctors: data.doctors.size,
    }))
    .sort((a, b) => b.patients - a.patients);
}

export function getRevenueByMonth(records: HospitalRecord[]) {
  const monthMap = new Map<string, number>();
  for (const r of records) {
    monthMap.set(r.month, (monthMap.get(r.month) || 0) + r.revenue);
  }
  return Array.from(monthMap.entries())
    .map(([month, revenue]) => ({ month: month.slice(5, 7) + '/' + month.slice(2, 4), revenue: Math.round(revenue) }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getDepartmentTrends(records: HospitalRecord[]) {
  const deptMonthMap = new Map<string, Map<string, { cases: number; revenue: number; totalLOS: number; ipCases: number }>>();
  
  for (const r of records) {
    if (!deptMonthMap.has(r.specialty)) deptMonthMap.set(r.specialty, new Map());
    const monthMap = deptMonthMap.get(r.specialty)!;
    const key = r.month;
    if (!monthMap.has(key)) monthMap.set(key, { cases: 0, revenue: 0, totalLOS: 0, ipCases: 0 });
    const entry = monthMap.get(key)!;
    entry.cases++;
    entry.revenue += r.revenue;
    if (r.caseType === 'IP' || r.caseType === 'DC') {
      entry.totalLOS += r.los;
      entry.ipCases++;
    }
  }

  return deptMonthMap;
}

export function getPayerDistribution(records: HospitalRecord[]) {
  const payerMap = new Map<string, number>();
  for (const r of records) {
    payerMap.set(r.payerMix, (payerMap.get(r.payerMix) || 0) + 1);
  }
  return Array.from(payerMap.entries()).map(([name, value]) => ({ name, value }));
}

export function getSeverityDistribution(records: HospitalRecord[]) {
  const sevMap = new Map<number, number>();
  for (const r of records) {
    sevMap.set(r.severity, (sevMap.get(r.severity) || 0) + 1);
  }
  return Array.from(sevMap.entries())
    .map(([severity, count]) => ({ severity: `Level ${severity}`, count }))
    .sort((a, b) => a.severity.localeCompare(b.severity));
}
