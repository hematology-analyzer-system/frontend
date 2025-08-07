"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import UserDetailsPage from '@/components/users/UserDetailsPage';
import { UserResponseDTO } from '@/type/user';

interface UserDetailsRouteParams {
  id: string;
}

interface UserDetailsProps {
  params: UserDetailsRouteParams;
}

export default function SingleUserDetailsPage({ params }: UserDetailsProps) {
  const router = useRouter();
  const userId = parseInt(params.id, 10);
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to manage feedback messages shown in the UI
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchUserDetails = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://fhard.khoa.email/api/iam/users/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to fetch user ${id}`);
      }

      const data: UserResponseDTO = await res.json();
      setUser(data);
      setFeedback(null); // Clear any previous feedback on successful fetch
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setFeedback({ message: err instanceof Error ? err.message : 'An unknown error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId, fetchUserDetails]);


  const handleSaveUserDetails = async (updatedUser: UserResponseDTO) => {
    setLoading(true);
    setFeedback(null); // Clear old feedback
    try {
      const updatePayload = {
        fullName: updatedUser.fullName,
        date_of_Birth: updatedUser.date_of_Birth,
        email: updatedUser.email,
        address: updatedUser.address,
        gender: updatedUser.gender,
        phone: updatedUser.phone,
        identifyNum: updatedUser.identifyNum,
        roleIds: updatedUser.roleIds,
      };

      console.log("Sending payload to backend:", updatePayload);

      const res = await fetch(`https://fhard.khoa.email/api/iam/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatePayload),
        credentials: 'include',
      });

      if (!res.ok) {
        let errorMessage = 'Failed to update user. An unknown error occurred.';
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
          } else {
            errorMessage = await res.text() || errorMessage;
          }
        } catch (parseError) {
          console.error("Error parsing backend error response:", parseError);
          errorMessage = `Failed to update user: ${res.status} ${res.statusText}. Could not parse error details.`;
        }
        throw new Error(errorMessage);
      }

      await fetchUserDetails(userId);
      setFeedback({ message: 'User updated successfully!', type: 'success' });

    } catch (err) {
      console.error("Error saving user details:", err);
      setFeedback({ message: err instanceof Error ? err.message : 'Failed to save user details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserStatus = async (isLock: boolean) => {
    setLoading(true);
    setFeedback(null); // Clear old feedback
    try {
      // Corrected payload key and URL logic
      const status = isLock ? 'unlock' : 'lock';
      const res = await fetch(`https://fhard.khoa.email/api/iam/users/${params.id}/${status}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        let errorMessage = 'Failed to update user status.';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          errorMessage = await res.text() || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await fetchUserDetails(userId);
      setFeedback({ message: 'User status updated successfully!', type: 'success' });
      
    } catch (err) {
      console.error("Error updating user status:", err);
      setFeedback({ message: err instanceof Error ? err.message : 'An unknown error occurred while updating status.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUserDetails = () => {
    router.back();
  };

  if (loading) {
    return <div className="text-center py-8">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-500">User not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">IAM / Users / {user.fullName}</div>
      {/* Display feedback message if available */}
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-md ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          <p>{feedback.message}</p>
        </div>
      )}
      <UserDetailsPage
        user={user}
        onSave={handleSaveUserDetails}
        onCancel={handleCancelUserDetails}
        onUpdateStatus={handleUpdateUserStatus}
      />
    </div>
  );
}
