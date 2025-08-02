'use client'
import SearchPatientBar from './components/SearchPatientBar';
import {Patient, PageFilter,fetchPatient, BASE} from './fetch'
import { useEffect, useState } from 'react';
import PatientTable from './components/PatientTable';
export default function PatientPage(){

    const [pageData, setPageData] = useState<PageFilter<Patient> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const size = 10;
    const [searchText, setSearchText] = useState('');
    const [sortKey, setSortKey] = useState<'nameAsc' | 'nameDesc'>('nameAsc');

  async function fetchSearch() {
    setLoading(true);
    try {const raw: PageFilter<Patient> = await fetchPatient();
          // const patient = await fetchPatient(raw.patientId);
          setPageData(raw);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
}
  useEffect(() => {
      const to = setTimeout(fetchFiltered, 1000);
      return () => clearTimeout(to);
    }, [searchText, sortKey, page]);
  
    async function fetchFiltered() {
      setLoading(true);
      try {
        const [sortBy, direction] =
          sortKey === 'nameAsc'
            ? ['fullName', 'asc']
            : ['fullName', 'desc'];
  
        const url = new URL(BASE + '/patients/filter');
        url.searchParams.set('searchText', searchText);
        url.searchParams.set('sortBy', sortBy);
        url.searchParams.set('direction', direction);
        url.searchParams.set('page', String(page + 1));
        url.searchParams.set('size', String(size));
  
        const res = await fetch(url.toString(), {
          credentials: 'include'
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = (await res.json()) as PageFilter<Patient>;
        setPageData(data);
      } catch (e) {
        console.error(e);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    }
  
  // useEffect(() => {
  //   const to = setTimeout(fetchSearch, 1000);
  //   return () => clearTimeout(to);
  // }, [searchText, sortKey, page, startDate, endDate]);
  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }
  if (!pageData) {
    return <div className="p-4 text-center text-red-600">Failed to load</div>;
  }
  const patientData: Patient[] = pageData.content;
      
    return(
        <div className="max-w-6xl mx-auto">
        <SearchPatientBar
            searchText={searchText}
            onSearch={q => { setPage(0); setSearchText(q); }}
            sortKey={sortKey}
            onSort={s => { setPage(0); setSortKey(s); }}
        
        />
        <PatientTable data={patientData} reload={fetchFiltered}/>
        </div>

    )
}