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
  PageResponse,
  // UI type for TestOrder after mapping
  TestOrder
} from './fetch';

export default function TestOrderPage() {
  const [pageData, setPageData] = useState<PageResponse<TestOrderRaw> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 5;

  const loadPage = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder';
      const response = await fetch(
        `${API_URL}/testorder/search?page=${page}&size=${size}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        console.error('Failed fetching test orders:', response.statusText);
        setPageData(null);
      } else {
        const data: PageResponse<TestOrderRaw> = await response.json();
        setPageData(data);
      }
    } catch (error) {
      console.error('Error loading test orders:', error);
      setPageData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [page]);

  if (loading) {
    return <div className="p-4 text-center">Loading…</div>;
  }
  if (!pageData) {
    return <div className="p-4 text-center text-red-600">Failed to load</div>;
  }

  // Map raw to UI type
  const orders: TestOrder[] = pageData.list.map(raw => ({
    testId: raw.testId,
    status: raw.status,
    updateBy: raw.updateBy,
    runBy: raw.runBy,
    runAt: raw.runAt,
    results: raw.results.map(r => ({
      id: r.id,
      reviewed: r.reviewed,
      updateBy: r.updateBy,
      detailResults: r.detailResults as ResultDetails[],
      comment_result: r.comment_result as Comment[],
    })),
    comments: raw.comments as CommentTO[],
    fullName: raw.fullName,
    address: raw.address,
    gender: raw.gender,
    dateOfBirth: raw.dateOfBirth,
    phone: raw.phone,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Filter Bar */}
      <FilterBar onSearch={() => {}} onSort={() => {}} onFilter={() => {}} />
      <TestOrderTable data={orders} reload={loadPage} />

      <div className="flex justify-between items-center p-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={!pageData.hasPrevious}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageData.currentPage + 1} / {pageData.totalPages}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!pageData.hasNext}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
