'use client';
import FilterBar from './components/FilterBar';
import { useEffect, useState } from 'react';
import TestOrderTable from './components/TestOrderTable';
import {
  // PageResponse imported for typing the paginated response
  PageFilter,
  // UI type for TestOrder after mapping
  TestOrder
} from './fetch';
import TestOrderStatusChart from './components/TestOrderStatusChart';
export default function TestOrderPage() {
  const [pageData, setPageData] = useState<PageFilter<TestOrder> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 20;
  const [searchText, setSearchText] = useState('');
  const [sortKey, setSortKey] = useState<'nameAsc' | 'nameDesc'>('nameAsc');
  
  // New date range state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder';

  // Trigger search when any filter changes
  useEffect(() => {
    const to = setTimeout(fetchFiltered, 1000);
    return () => clearTimeout(to);
  }, [searchText, sortKey, page, startDate, endDate]);

  async function fetchFiltered() {
    setLoading(true);
    try {
      const [sortBy, direction] =
        sortKey === 'nameAsc'
          ? ['runAt', 'asc']
          : ['runAt', 'desc'];

      const url = new URL(API_URL + '/testorder/filter');
      url.searchParams.set('searchText', searchText);
      url.searchParams.set('sortBy', sortBy);
      url.searchParams.set('direction', direction);
      url.searchParams.set('offsetPage', String(page + 1));
      url.searchParams.set('limitOnePage', String(size));
      
      // Add date range parameters
       if (startDate) {
        // Convert date to LocalDateTime format (start of day)
        url.searchParams.set('fromDate', `${startDate}T00:00:00`);
      }
      if (endDate) {
        // Convert date to LocalDateTime format (end of day)
        url.searchParams.set('toDate', `${endDate}T23:59:59`);
      }

      const res = await fetch(url.toString(), {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = (await res.json()) as PageFilter<TestOrder>;
      setPageData(data);
    } catch (e) {
      console.error(e);
      setPageData(null);
    } finally {
      setLoading(false);
    }
  }

  // Handler functions for date filter
  const handleStartDateChange = (date: string) => {
    setPage(0); // Reset to first page when filter changes
    setStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setPage(0); // Reset to first page when filter changes
    setEndDate(date);
  };

  const handleClearDateFilter = () => {
    setPage(0);
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }
  if (!pageData) {
    return <div className="p-4 text-center text-red-600">Failed to load</div>;
  }
  
  console.log(pageData);
  
  // Map raw to UI type
  const orders: TestOrder[] = pageData.content.map(raw => ({
    id: raw.id,
    fullName: raw.fullName,
    age: raw.age,
    gender: raw.gender,
    phone: raw.phone,
    status: raw.status,
    createdBy: raw.createdBy,
    runBy: raw.runBy,
    runAt: raw.runAt
  }));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Filter Bar with Date Range */}
      <TestOrderStatusChart data={pageData}/>
      <FilterBar
        searchText={searchText}
        onSearch={q => { setPage(0); setSearchText(q); }}
        sortKey={sortKey}
        onSort={s => { setPage(0); setSortKey(s); }}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onClearDateFilter={handleClearDateFilter}
      />
      
      <TestOrderTable data={orders} reload={fetchFiltered} />

      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={pageData.first}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageData.number + 1} / {pageData.totalPages}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={pageData.last}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}