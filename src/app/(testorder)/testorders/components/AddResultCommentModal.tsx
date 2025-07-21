// src/app/testorder/components/AddResultCommentModal.tsx
'use client';

import { FC, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  resultId: number;
  onClose(): void;
  onSaved(newComment: Comment): void;
}

export interface Comment {
  id: number;
  createdAt: string;
  modifiedAt: string;
  content: string;
  resultId?: number;
  testOrderId?: number;
}

const BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/testorder`
  : 'http://localhost:8082/testorder';

const AddResultCommentModal: FC<Props> = ({ resultId, onClose, onSaved }) => {
  const [text, setText] = useState('');

  const handleSave = async () => {
    if (!text.trim()) return;
    const res = await fetch(
      `${BASE}/api/results/${resultId}/comments`,
      {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ content: text })
      }
    );
    if (!res.ok) {
      alert('Failed to save comment');
      return;
    }
    const newComment: Comment = await res.json();
    onSaved(newComment);
    onClose();
    setText('');
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg border border-teal-500 p-5 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20}/>
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">Add comment</h3>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          className="w-full p-3 rounded-lg bg-cyan-100 focus:outline-none resize-none text-sm"
          placeholder="Enter your comment..."
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create &amp; Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddResultCommentModal;
