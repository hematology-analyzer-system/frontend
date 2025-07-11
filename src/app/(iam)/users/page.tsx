"use client";

import React, { useState, useEffect, useCallback } from 'react';
import UserCard from '@/components/Card/UserCard';
import Pagination from '@/components/Pagination/Pagination';
import SearchFilterBar from '@/components/Layout/SearchFilterBar'; 
import { UserResponseDTO, PageResponse } from '@/type/user';

export default function UsersPage() {
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
      offsetPage: currentPage.toString(), 
      limitOnePage: limitOnePage.toString(),
      ...(selectedRole && { role: selectedRole }),
      ...(selectedLocation && { location: selectedLocation }),
    });

    try {
      const res = await fetch(`http://localhost:8080/iam/users/filter?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch users');
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

  const handleViewUser = (userId: number) => { /* implementation */ };
  const handleEditUser = (userId: number) => { /* implementation */ };
  const handleDeleteUser = (userId: number) => { /* implementation */ };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">IAM / Users</div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users Management</h1>

      {/* Using the modified SearchFilterBar component */}
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

      {/* ... Loading, Error, and Empty state display ... */}


      {!loading && !error && users.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onView={handleViewUser}
                onEdit={handleEditUser}
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