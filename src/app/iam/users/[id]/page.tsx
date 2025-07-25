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

  // No longer need crawlObject as we know the structure now

  const fetchUserDetails = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/iam/users/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to fetch user ${id}`);
      }

      const data: UserResponseDTO = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
    try {
      setLoading(true);

      const updatePayload = {
        fullName: updatedUser.fullName,
        date_of_Birth: updatedUser.date_of_Birth,
        email: updatedUser.email,
        address: updatedUser.address,
        gender: updatedUser.gender,
        phone: updatedUser.phone,
        status: updatedUser.status,
        identifyNum: updatedUser.identifyNum,
        roleIds: updatedUser.roleIds, // Now sending roleIds
      };

      console.log("Sending payload to backend:", updatePayload);

      const res = await fetch(`http://localhost:8080/iam/users/${params.id}`, {
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

      // Re-fetch user details to get the most updated state from the backend
      // This will also cause UserDetailsPage to re-render with fresh data and exit edit mode.
      await fetchUserDetails(userId);
      alert('User updated successfully!');

    } catch (err) {
      console.error("Error saving user details:", err);
      setError(err instanceof Error ? err.message : 'Failed to save user details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUserDetails = () => {
    // When cancelled, we just go back. UserDetailsPage handles reverting its own state.
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
      <UserDetailsPage user={user} onSave={handleSaveUserDetails} onCancel={handleCancelUserDetails} />
    </div>
  );
}