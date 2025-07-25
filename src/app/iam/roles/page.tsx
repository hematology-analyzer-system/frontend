"use client";

import React, { useState, useEffect, useCallback } from 'react';
import RoleCard from '@/components/Card/RoleCard';
import RoleForm from '@/components/Form/RoleForm'; // Still used for creation
import Pagination from '@/components/Pagination/Pagination';
import SearchFilterBar from '@/components/Layout/SearchFilterBar';
import { RoleResponseDTO, PageResponseRole, PrivilegeResponseDTO, RoleRequest } from '@/type/user';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRoles, setTotalRoles] = useState<number>(0);
  const limitOnePage = 12;

  const [searchText, setSearchText] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>(''); // Not currently used in backend filter, but kept for UI
  const [selectedLocation, setSelectedLocation] = useState<string>(''); // Not currently used in backend filter, but kept for UI
  const [selectedSort, setSelectedSort] = useState<string>('A - Z');

  const [isFormOpen, setIsFormOpen] = useState(false);
  // editingRole is now only for the Create Form context
  const [editingRole, setEditingRole] = useState<RoleResponseDTO | null>(null);
  const [allPrivileges, setAllPrivileges] = useState<PrivilegeResponseDTO[]>([]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    let sortByBackend = 'name';
    let directionBackend = 'asc';
    if (selectedSort === 'A - Z') {
      sortByBackend = 'name';
      directionBackend = 'asc';
    } else if (selectedSort === 'Z - A') {
      sortByBackend = 'name';
      directionBackend = 'desc';
    }

    const requestBody: RoleRequest = {
      page_num: currentPage,
      page_size: limitOnePage,
      filter: searchText,
      sort: sortByBackend,
    };

    try {
      const res = await fetch(`http://localhost:8080/iam/roles/filter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      if (!res.ok) {
        let errorMessage = 'Failed to fetch roles';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data: PageResponseRole = await res.json();

      console.log('Fetched roles:', data.roles);

      if (data && Array.isArray(data.roles)) {
        setRoles(data.roles);
      } else {
        console.warn("API response 'roles' field is missing or not an array:", data);
        setRoles([]);
      }

      setTotalPages(data.totalPages || 1);
      setTotalRoles(data.totalElements || 0);

    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setRoles([]);
      setTotalPages(1);
      setTotalRoles(0);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    limitOnePage,
    searchText,
    selectedSort,
  ]);

  const fetchAllPrivileges = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/iam/privileges`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        let errorMessage = 'Failed to fetch privileges';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse privilege error response:", jsonError);
        }
        throw new Error(errorMessage);
      }
      const data: PrivilegeResponseDTO[] = await res.json();
      setAllPrivileges(data);
    } catch (err) {
      console.error("Error fetching privileges:", err);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchAllPrivileges();
  }, [fetchRoles, fetchAllPrivileges]);

  const handleCreateRole = () => {
    setEditingRole(null); // Explicitly set to null for creation
    setIsFormOpen(true); // Open the RoleForm for creation
  };

  // handleEditRole is no longer needed as RoleCard handles navigation directly

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm(`Are you sure you want to delete role with ID: ${roleId}? This action cannot be undone.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/iam/roles/${roleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        let errorMessage = 'Failed to delete role';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse delete error response:", jsonError);
        }
        throw new Error(errorMessage);
      }
      alert('Role deleted successfully!');
      fetchRoles();
    } catch (err) {
      console.error("Error deleting role:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while deleting role.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (roleData: RoleResponseDTO) => {
    setLoading(true);
    try {
      // This handleSaveRole is now primarily for *creating* new roles from this page
      // Editing will happen on the [id]/page.tsx
      const method = 'POST'; // Always POST when saving from the 'Create New Role' button on this page
      const url = 'http://localhost:8080/iam/roles';

      const privilegesIdsForBackend = roleData.privileges.map(p => p.privilegeId);

      const roleToSend = {
          name: roleData.name,
          code: roleData.code,
          description: roleData.description,
          privilegesIds: privilegesIdsForBackend,
      };

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleToSend),
        credentials: 'include',
      });

      if (!res.ok) {
        let errorMessage = `Failed to create role`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse save error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      alert(`Role created successfully!`);
      setIsFormOpen(false);
      fetchRoles(); // Re-fetch roles to update the list
    } catch (err) {
      console.error("Error saving role:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while saving role.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">IAM / Roles</div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Roles Management</h1>

      <SearchFilterBar
        searchText={searchText}
        onSearchChange={setSearchText}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        // onApplyFilters={handleApplyFilters}
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateRole} // This will now only trigger creation form
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create New Role
        </button>
      </div>

      {loading && <div className="text-center py-8 text-blue-500">Loading roles...</div>}
      {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
      {!loading && !error && roles.length === 0 && (
        <div className="text-center py-8 text-gray-500">No roles found.</div>
      )}

      {!loading && !error && roles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <RoleCard
                key={role.roleId}
                role={role}
                // onEdit prop removed as RoleCard now handles navigation directly
                onDelete={handleDeleteRole}
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

      {/* RoleForm is now only conditionally rendered for creation */}
      {isFormOpen && (
        <RoleForm
          role={editingRole} // Will be null for new role creation
          allPrivileges={allPrivileges}
          onSave={handleSaveRole} // This now exclusively handles POST (create)
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}