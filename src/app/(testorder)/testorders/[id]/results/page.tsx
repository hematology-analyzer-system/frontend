'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTestOrderById, TestOrderRaw, Result, BASE, Comment, ResultDetails } from '../../fetch';
import AddResultCommentModal from '../../components/AddResultCommentModal';
import Link from 'next/link';
import {Edit, Trash} from 'lucide-react'
import EditResultCommentModel from '../../components/EditResultCommentModel'

export default function TestOrderResultsPage() {
  const { id } = useParams();               // lấy test-order ID từ URL
  const [order, setOrder]       = useState<TestOrderRaw | null>(null);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<number>(0);
  const [showAdd, setShowAdd]   = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [showEdit, setShowEdit]             = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [editedValues, setEditedValues] = useState<number[]>([]);
  function extractIdNum(runBy: string | null): string | null {
  if (!runBy) {
    return null
  }
  const m = runBy.match(/Email:\s*([^|]+)/);
  return m ? m[1] : null;
}
  function formatDDMMYYYY(isoString: string): string {
  // Tạo đối tượng Date từ chuỗi
  const date = new Date(isoString);
  // Nếu không parse được → trả về chuỗi rỗng
  if (isNaN(date.getTime())) {
    return '';
  }

  const day   = date.getDate().toString().padStart(2, '0');        // ngày, 2 chữ số
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // tháng, 2 chữ số
  const year  = date.getFullYear().toString();                     // năm, 4 chữ số

  return `${day}/${month}/${year}`;
}
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
        r.id === result.id
          ? { ...r, comments: [...r.comment_result, c] }
          : r
      );
      return { ...prev, results: newResults };
    });
  };
   const handleModifyComment = (commentId: number) => {
    // tìm comment trong result hiện tại
    const c = result.comment_result.find(c => c.id === commentId);
    if (!c) return;
    setEditingComment(c);
    setShowEdit(true);
  };
  const saveModifiedOrderComment = async (updatedContent: string) => {
  if (!order || !editingComment) return;
  try {
    const res = await fetch(
      `${BASE}/comment/result/${editingComment.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updatedContent })
    });
    if (!res.ok) throw new Error(await res.text());

    // sau khi server trả về comment mới (hoặc OK)
    // cập nhật lại mảng comments trong state
    setOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        results: prev.results.map(r => {
          // chỉ update trong đúng result đang sửa
          if (r.id !== result.id) return r;
          return {
            ...r,
            comment_result: r.comment_result.map(c => {
              if (c.id !== editingComment.id) return c;
              // thay comment cũ bằng phiên bản mới
              return {
                ...c,
                content: updatedContent,
                modifiedAt: new Date().toISOString()
              };
            })
          };
        })
      };
    });

    setShowEdit(false);
    setEditingComment(null);
  } catch (err) {
    console.error(err);
    alert('Failed to modify comment');
  }
};
  const handleDeleteComment = async (id: number) => {
    if (!order) return;
  if (!confirm('Are you sure you want to delete this comment?')) return;
    
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder'}/comment/result/${id}`,
      { method: 'DELETE',
        credentials: 'include'
       }
    );
    if (!res.ok) throw new Error(res.statusText);

    // remove comment khỏi state
    setOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.filter(c => c.id !== id)
      };
    });
  } catch (err) {
    console.error(err);
    alert('Failed to delete comment');
  }
  }
  useEffect(() => {
    if (!order) return;

    // compute the details array right here:
    const dets = (order.results[selected].detailResults) as ResultDetails[];
    setEditedValues(dets.map(d => d.value));
    setEditMode(false);
  }, [order, selected]);

  // xử lý khi user chỉnh một giá trị
  const onChangeValue = (idx: number, v: number) => {
    setEditedValues(vals => {
      const copy = [...vals];
      copy[idx] = v;
      return copy;
    });
  };

  // lưu lại
  const saveEdits = async () => {
    // validate
    for (let i = 0; i < details.length; i++) {
      const v = editedValues[i];
      if (v < details[i].rangeMin || v > details[i].rangeMax) {
        alert(
          `Value for "${details[i].paramName}" phải nằm trong [${details[i].rangeMin}, ${details[i].rangeMax}]`
        );
        return;
      }
    }
    // gửi lên server
    const res = await fetch(
      `${BASE}/result/${result.id}`, // endpoint PUT tương ứng
      {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          details.map((d, i) => ({
            paramName: d.paramName,
            value: editedValues[i]
          }))
        )
      }
    );
    if (!res.ok) {
      alert('Failed to save details');
      return;
    }
    // reload lại toàn bộ order
    const fresh = await fetchTestOrderById(Number(id));
    setOrder(fresh);
    setEditMode(false);
  };
  const handlePrint = () => {
    window.print();
  };
  if (loading) return <div>Loading…</div>;
  if (!order) return <div>Testorder not found</div>;
  if (!order.results) return <div>No results available</div>;

  const results = order.results;
  const result: Result  = results[selected];
  const details = result.detailResults as ResultDetails[];

  // mỗi lần chuyển tab result, reset editedValues
  

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Breadcrumb / Title */}
      <h1 className="text-3xl font-bold mb-6">Testorder Results</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {results.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => setSelected(idx)}
            className={`px-4 py-2 rounded-t-lg border
               ${selected === idx
                 ? 'bg-green-50 border-green-500 text-green-800'
                 : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
          >
            Result – {r.id}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left panel: Result Detail */}
        <div className="p-6 bg-white rounded-lg border border-green-300 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Result – {result.id}</h2>
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
  <thead>
    <tr className="border-b">
      {['ParamName','Value','Unit','RangeMin','RangeMax'].map(h => (
        <th key={h} className="py-2 px-1">{h}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {result.detailResults.map((d: ResultDetails, i: number)  => (
      <tr key={d.id} className="border-b">
        <td className="py-2 px-1">{d.paramName}</td>
        <td className="py-2 px-1">{editMode ? (
                        <input
                          type="number"
                          value={editedValues[i]}
                          min={d.rangeMin}
                          max={d.rangeMax}
                          onChange={e => onChangeValue(i, +e.target.value)}
                          className="w-20 px-1 py-1 border rounded"
                        />
                      ) : (
                        d.value
                      )}</td>
        <td className="py-2 px-1">{d.unit}</td>
        <td className="py-2 px-1">{d.rangeMin}</td>
        <td className="py-2 px-1">{d.rangeMax}</td>
      </tr>
    ))}
  </tbody>
</table>
          </div>

           {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            {editMode ? (
              <>
                <button
                  onClick={saveEdits}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditedValues(details.map(d => d.value));
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {!editMode && order.status.toLowerCase() !== 'reviewed' && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update detail
                  </button>
                )}
            <button
              onClick={async () => {
                // DELETE result
                await fetch(`${BASE}/result/${result.id}`, { method: 'DELETE',credentials: 'include' });
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
            <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Print results
                </button>
              </>
            )}
            
          </div>
        </div>

        {/* Right panel: comments */}
        <div className="p-6 bg-white rounded-lg border border-green-300 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Result comment</h2>

          {/* {result.comments.length === 0 */}
          {!result.comment_result
            ? <p className="italic">No comments yet.</p>
            : result.comment_result.map((c: Comment) => (
                // <div key={c.id} className="mb-4">
                <div className="mb-6 flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">
                {extractIdNum(c.createdBy)}
              </p>
              <p className="text-gray-500 text-sm">
                {formatDDMMYYYY(c.createdAt)}
              </p>
              <p className="border-l-2 border-green-400 pl-4 italic">
                “{c.content}”
              </p>
            </div>

            {/* Hai nút Modify / Delete ở bên phải */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleModifyComment(c.id)}
                className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Edit size={14}></Edit>
              </button>
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
              >
                <Trash size={14}></Trash>
              </button>
            </div>
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
          resultId={result.id}
          onClose={() => setShowAdd(false)}
          onSaved={handleNewComment}
        />
      )}
      {showEdit && editingComment && (
        <EditResultCommentModel
          comment={editingComment}
          onClose={() => setShowEdit(false)}
          onSave={saveModifiedOrderComment}
        />
      )}
    </div>
  );
}
