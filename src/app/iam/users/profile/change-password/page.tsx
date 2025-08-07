"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get the userId from local storage. This is necessary to know which user to update.
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const currentUserId = storedUserId ? Number(storedUserId) : null;

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setFeedback({ message: 'All fields are required.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ message: 'New password and confirmation password do not match.', type: 'error' });
      return;
    }
    if (oldPassword === newPassword) {
      setFeedback({ message: 'New password cannot be the same as the old password.', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      if (!currentUserId || isNaN(currentUserId)) {
        throw new Error("Invalid User ID. Cannot change password.");
      }
      
      const res = await fetch(`http://localhost:8080/iam/users/${currentUserId}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: 'include'
      });

      if (!res.ok) {
        // Read the response body once as text
        const errorText = await res.text(); 
        let errorMessage = 'Failed to change password. Please check your old password.';
        try {
          // Attempt to parse the text as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText;
        } catch {
          // If JSON parsing fails, use the raw text
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      setFeedback({ message: 'Password changed successfully!', type: 'success' });
      // Reset form fields after successful change.
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      console.error("Error changing password:", err);
      setFeedback({ message: err instanceof Error ? err.message : 'An unknown error occurred.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-xl">
        {feedback && (
          <div
            className={`mb-4 p-4 rounded-md ${
              feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            <p>{feedback.message}</p>
          </div>
        )}
        <form onSubmit={handlePasswordChangeSubmit}>
          <div className="mb-4">
            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:text-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}