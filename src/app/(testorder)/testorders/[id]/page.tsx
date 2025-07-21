// src/app/testorder/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTestOrderById, fetchPatient, TestOrderRaw, TestOrder } from '../fetch';
import { X } from 'lucide-react';

export default function TestOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<TestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]     = useState(false);
  const [commentText, setText]  = useState('');

  useEffect(() => {
    (async () => {
      try {
        const raw: TestOrderRaw = await fetchTestOrderById(Number(id));
        const patient = await fetchPatient(raw.patientId);
        setOrder({ ...raw, patient });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!order)  return <div>Testorder not found</div>;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this testorder?')) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder'}/api/test-orders/${order.testId}`,
      { method: 'DELETE' }
    );
    router.push('/testorder');
  };
  const handleSaveComment = async () => {
    if (!commentText.trim()) return;    // không gửi nếu rỗng
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082/testorder'}/api/test-orders/${order.testId}/comments?content=${encodeURIComponent(commentText)}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error('Error creating comment');
      const newComment = await res.json();
      // thêm vào state để hiển thị ngay
      setOrder({
        ...order,
        comments: [...order.comments, newComment],
      });
      // đóng modal
      setAdding(false);
      setText('');
    } catch (e) {
      console.error(e);
      alert('Failed to save comment');
    }
  };

  const handleUpdate      = () => router.push(`/testorders/${order.testId}/edit`);
  const handleViewResults = () => router.push(`/testorders/${order.testId}/results`);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Testorder Detail #{order.testId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left panel */}
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-center">Patient Information</h2>
          <div className="space-y-1">
            <p><span className="font-bold">Full name:</span> {order.patient.fullName}</p>
            <p><span className="font-bold">Gender:</span>    {order.patient.gender}</p>
            <p><span className="font-bold">Age:</span>       {new Date().getFullYear() - new Date(order.patient.dateOfBirth).getFullYear()}</p>
            <p><span className="font-bold">Phone number:</span> {order.patient.phone}</p>
            <p><span className="font-bold">Address:</span>   {order.patient.address}</p>
            <p><span className="font-bold">Email:</span>     {order.patient.email}</p>
          </div>

          <section className="text-center mb-6">
        <h2 className="text-xl font-semibold">Status</h2>
        <p className="text-green-600 font-bold">{order.status.toLowerCase()}</p>
      </section>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleUpdate}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >Update detail</button>
            {order.status === 'COMPLETED' ? (
          /* Nếu đã completed: show View Results */
          <button
            onClick={handleViewResults}
            className="px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            View Results
          </button>
        ) : (
          /* Nếu chưa completed: show Generate Results */
          <button
            onClick={() => router.push(`/testorder/${order.testId}/results/generate`)}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Gen Results
          </button>
        )}
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >Delete</button>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold text-center">Testorder Comment</h2>

          {order.comments.length === 0 ? (
            <p className="italic text-center">No comments yet.</p>
          ) : (
            order.comments.map(c => (
              <div key={c.id} className="mb-6">
                <p className="text-gray-500 text-sm">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <p className="border-l-2 border-green-400 pl-4 italic">
                  “{c.content}”
                </p>
              </div>
            ))
          )}

          <button
            onClick={() => setAdding(true)}
            className="mt-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add comment
          </button>
        </div>
      </div>

      {/* Modal Add Comment */}
      {adding && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg border border-teal-500 p-6 w-[90%] max-w-lg">
            {/* Close icon */}
            <button
              onClick={() => setAdding(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl mb-4">Add comment</h3>
            {/* Khối textarea background nhạt */}
            <div className="bg-cyan-100 rounded-lg p-4 h-40">
              <textarea
                value={commentText}
                onChange={e => setText(e.target.value)}
                placeholder="Enter your comment..."
                className="w-full h-full bg-transparent resize-none outline-none"
              />
            </div>

            {/* Create & Save */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveComment}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create &amp; Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
