// src/app/(iam)/users/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import UserCard from '@/components/Card/UserCard';
import Pagination from '@/components/Pagination/Pagination';
import SearchFilterBar from '@/components/Layout/SearchFilterBar'; 
import { UserResponseDTO, PageResponse } from '@/type/user';

export default function UsersPage() {
  const router = useRouter(); // Initialize useRouter
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('A - Z'); 

  const limitOnePage = 12; 

  const sortBy = 'fullName'; // Assuming 'fullName' for sorting users
  const direction = selectedSort === 'Z - A' ? 'desc' : 'asc';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      searchText: searchText || '',
      sortBy: sortBy,
      direction: direction,
      // Reverting to your original logic: currentPage.toString()
      offsetPage: currentPage.toString(), 
      limitOnePage: limitOnePage.toString(),
      ...(selectedRole && { role: selectedRole }),
      ...(selectedLocation && { location: selectedLocation }),
    });

    try {
      const url = `http://localhost:8080/iam/users/filter?${params.toString()}`;
      console.log("fetching: ", url);
      const options :RequestInit = {
        method: 'GET',
        credentials: 'include',
      };

      console.log("Fetch options: ", options);
      const res = await fetch(url, options);
      // const res = await fetch(`http://localhost:8080/iam/users/filter?${params.toString()}`, {
      //   method: 'GET',
      //   credentials: 'include',
      // });

      if (!res.ok) {
        let errorMessage = 'Failed to fetch users';

        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            // Try to read plain text fallback
            const errorText = await res.text();
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.warn("Error parsing error response:", e);
        }

        throw new Error(errorMessage);
      }


      const data: PageResponse<UserResponseDTO> = await res.json();
      
      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalElements);
      
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [searchText, selectedRole, selectedLocation, selectedSort, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setCurrentPage(1); 
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Implementation for 'View' button to navigate ---
  const handleViewUser = (userId: number) => {
    // Navigate to the user details page using Next.js router
    router.push(`/iam/users/${userId}`); 
  };

  // --- Implementations for 'Edit' and 'Delete' buttons ---
  const handleEditUser = (userId: number) => {
    console.log(`Edit user with ID: ${userId}`);
    // You could navigate to the same details page with an edit mode flag, e.g.:
    router.push(`/iam/users/${userId}?mode=edit`);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/iam/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      // Re-fetch users to update the list after deletion
      fetchUsers(); 
      alert('User deleted successfully!');
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete user.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">IAM / Users</div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users Management</h1>

      <SearchFilterBar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />

      {loading && <div className="text-center py-8 text-blue-500">Loading users...</div>}
      {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8 text-gray-500">No users found.</div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onView={handleViewUser} // This will now navigate
                onEdit={handleEditUser} // This will also navigate (optional edit mode)
                onDelete={handleDeleteUser}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}