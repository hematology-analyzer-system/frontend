// src/app/(iam)/users/[id]/page.tsx
"use client"; // If you need client-side interactivity like the inline editing

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js App Router navigation
import UserDetailsPage from '@/components/users/UserDetailsPage'; // Your existing UserDetailsPage component
import { UserResponseDTO } from '@/type/user'; // Your user DTO

interface UserDetailsRouteParams {
  id: string; // The ID from the URL will be a string
}

interface UserDetailsProps {
  params: UserDetailsRouteParams;
}

export default function SingleUserDetailsPage({ params }: UserDetailsProps) {
  const router = useRouter();
  const userId = parseInt(params.id, 10); // Parse the ID from the URL
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a single user's details
  const fetchUserDetails = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/iam/users/${id}`, { // Fetch by ID
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
    if (userId) { // Ensure userId is valid before fetching
      fetchUserDetails(userId);
    }
  }, [userId, fetchUserDetails]);

  const handleSaveUserDetails = async (updatedUser: UserResponseDTO) => {
    // Implement API call to update user details
    try {

      console.log(updatedUser);

      setLoading(true);
      const res = await fetch(`http://localhost:8080/iam/users/${updatedUser.id}`, {
        method: 'PUT', // Or PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      setUser(updatedUser); // Update local state
      alert('User updated successfully!');
      // Optionally, navigate back to the list or to a confirmation page
      // router.push('/iam/users');
    } catch (err) {
      console.error("Error saving user details:", err);
      setError(err instanceof Error ? err.message : 'Failed to save user details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUserDetails = () => {
    router.back(); // Go back to the previous page (user list)
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
      <UserDetailsPage
        user={user}
        onSave={handleSaveUserDetails}
        onCancel={handleCancelUserDetails}
      />
    </div>
  );
}