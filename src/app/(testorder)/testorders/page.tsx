'use client';
import FilterBar from './components/FilterBar';
import { useEffect, useState } from 'react';
import TestOrderTable from './components/TestOrderTable';
import {
  TestOrderRaw,
  ResultDetails,
  CommentTO,
  Comment,
  // PageResponse imported for typing the paginated response
  PageFilter,
  // UI type for TestOrder after mapping
  TestOrder
} from './fetch';

export default function TestOrderPage() {
  const [pageData, setPageData] = useState<PageFilter<TestOrder> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 5;
  const [searchText, setSearchText] = useState('');
  const [sortKey, setSortKey]       = useState<'nameAsc' | 'nameDesc'>('nameAsc');
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder';
  // const loadPage = async () => {
  //   setLoading(true);
  //   try {
      
  //     const response = await fetch(
  //       `${API_URL}/testorder/search?page=${page}&size=${size}`,
  //       { credentials: 'include' }
  //     );
  //     if (!response.ok) {
  //       console.error('Failed fetching test orders:', response.statusText);
  //       setPageData(null);
  //     } else {
  //       const data: PageResponse<TestOrder> = await response.json();
  //       setPageData(data);
  //     }
  //   } catch (error) {
  //     console.error('Error loading test orders:', error);
  //     setPageData(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  useEffect(() => {
    const to = setTimeout(fetchFiltered, 300);
    return () => clearTimeout(to);
  }, [searchText, sortKey, page]);

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
      {/* Filter Bar */}
      <FilterBar
        searchText={searchText}
        onSearch={q => { setPage(0); setSearchText(q); }}
        sortKey={sortKey}
        onSort={s => { setPage(0); setSortKey(s); }}
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
