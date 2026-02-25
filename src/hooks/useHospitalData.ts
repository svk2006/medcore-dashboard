import { useState, useEffect } from 'react';
import { HospitalRecord, parseCSV } from '@/lib/parseHospitalData';

export function useHospitalData() {
  const [data, setData] = useState<HospitalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Simulate realistic loading time
      await new Promise(resolve => setTimeout(resolve, 1800));
      const res = await fetch('/data/hospital_data.csv');
      const text = await res.text();
      setData(parseCSV(text));
      setLoading(false);
    };
    load();
  }, []);

  return { data, loading };
}
