'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTestOrderById, TestOrderRaw, Result, BASE, Comment } from '../../fetch';
import AddResultCommentModal from '../../components/AddResultCommentModal';
import Link from 'next/link';

export default function TestOrderResultsPage() {
  const { id } = useParams();               // lấy test-order ID từ URL
  const [order, setOrder]       = useState<TestOrderRaw | null>(null);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<number>(0);
  const [showAdd, setShowAdd]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const o = await fetchTestOrderById(Number(id));
        setOrder(o);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  const handleNewComment = (c: Comment) => {
    setOrder(prev => {
      if (!prev) return prev;
      const newResults = prev.results.map(r =>
        r.resultId === result.resultId
          ? { ...r, comments: [...r.comments, c] }
          : r
      );
      return { ...prev, results: newResults };
    });
  };

  if (loading) return <div>Loading…</div>;
  if (!order) return <div>Testorder not found</div>;
  if (order.results.length === 0) return <div>No results available</div>;

  const results = order.results;
  const result: Result  = results[selected];

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Breadcrumb / Title */}
      <h1 className="text-3xl font-bold mb-6">Testorder Results</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {results.map((r, idx) => (
          <button
            key={r.resultId}
            onClick={() => setSelected(idx)}
            className={`px-4 py-2 rounded-t-lg border
               ${selected === idx
                 ? 'bg-green-50 border-green-500 text-green-800'
                 : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
          >
            Result – {r.resultId}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left panel: Result Detail */}
        <div className="p-6 bg-white rounded-lg border border-green-300 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Result – {result.resultId}</h2>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  {['ParamName','Value','Unit','RangeMin','RangeMax'].map(h => (
                    <th key={h} className="py-2 px-1 text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-1">{result.details.parameterName}</td>
                  <td className="py-2 px-1">{result.details.value}</td>
                  <td className="py-2 px-1">{result.details.unit}</td>
                  <td className="py-2 px-1">{result.details.rangeMin}</td>
                  <td className="py-2 px-1">{result.details.rangeMax}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link href={`/testorder/${order.testId}/results/${result.resultId}/edit`}>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Update detail
              </button>
            </Link>
            <button
              onClick={async () => {
                // DELETE result
                await fetch(`${BASE}/api/results/${result.resultId}`, { method: 'DELETE' });
                // reload page
                setLoading(true);
                const o2 = await fetchTestOrderById(Number(id));
                setOrder(o2);
                setSelected(0);
                setLoading(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
            <Link href={`/testorder/${order.testId}/results/${result.resultId}/print`}>
              <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                Print results
              </button>
            </Link>
          </div>
        </div>

        {/* Right panel: comments */}
        <div className="p-6 bg-white rounded-lg border border-green-300 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Result comment</h2>

          {result.comments.length === 0
            ? <p className="italic">No comments yet.</p>
            : result.comments.map((c: Comment) => (
                <div key={c.id} className="mb-4">
                  <p className="text-gray-500 text-sm">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  <p className="border-l-2 border-green-400 pl-4 italic">
                    “{c.content}”
                  </p>
                </div>
            ))
          }

          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add comment
          </button>
        </div>
      </div>

      {/* Modal Add comment */}
      {showAdd && (
        <AddResultCommentModal
          resultId={result.resultId}
          onClose={() => setShowAdd(false)}
          onSaved={handleNewComment}
        />
      )}
    </div>
  );
}
