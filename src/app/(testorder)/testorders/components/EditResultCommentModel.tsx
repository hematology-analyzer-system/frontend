'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Comment } from '../fetch';

interface EditOrderCommentModalProps {
  comment: Comment;
  onClose: () => void;
  onSave: (updatedContent: string) => void;
}

export default function EditOrderCommentModel({
  comment,
  onClose,
  onSave,
}: EditOrderCommentModalProps) {
  const [content, setContent] = useState(comment.content);

  const handleSave = () => {
    onSave(content.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-[9999] flex justify-center items-center">
      <div className="relative bg-white rounded-lg border border-gray-300 p-6 w-[90%] max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded focus:outline-none"
        />

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={content.trim() === ''}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
