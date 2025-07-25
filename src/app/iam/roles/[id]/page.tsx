// src/app/(iam)/roles/[id]/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import RoleForm from '@/components/Form/RoleForm';
import { RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';

interface RoleEditPageProps {
  params: { id: string }; // Next.js dynamic route parameter
}

export default function RoleEditPage({ params }: RoleEditPageProps) {
  const router = useRouter();
  const roleId = parseInt(params.id, 10); // Parse the ID from the URL
  const [editingRole, setEditingRole] = useState<RoleResponseDTO | null>(null);
  const [allPrivileges, setAllPrivileges] = useState<PrivilegeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch a specific role by ID
  const fetchRoleById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/iam/roles/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        let errorMessage = `Failed to fetch role with ID ${id}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data: RoleResponseDTO = await res.json();
      
      setEditingRole(data);
    } catch (err) {
      console.error(`Error fetching role ${id}:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setEditingRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch all privileges (reused from RolesPage)
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
      // It's okay to continue if privileges fail, but log the error
    }
  }, []);

  useEffect(() => {
    if (roleId && !isNaN(roleId)) {
      fetchRoleById(roleId);
      fetchAllPrivileges();
    } else {
      setError("Invalid Role ID provided.");
      setLoading(false);
    }
  }, [roleId, fetchRoleById, fetchAllPrivileges]);

  const handleSaveRole = async (roleData: RoleResponseDTO) => {
    setLoading(true);
    try {
      const method = roleData.roleId === 0 ? 'POST' : 'PUT'; // Should always be PUT for this page
      const url = `http://localhost:8080/iam/roles/${roleData.roleId}`; // Always update existing

      // Convert privileges (PrivilegeResponseDTO[]) to privilegesIds (number[])
      const privilegesIdsForBackend = roleData.privileges.map(p => p.privilegeId);

      const roleToSend = {
          roleId: roleData.roleId, // Always send roleId for PUT
          name: roleData.name,
          code: roleData.code,
          description: roleData.description,
          privilegesIds: privilegesIdsForBackend, // Sending array of privilege IDs
      };

      const res = await fetch(url, {
        method: method, // Will be 'PUT'
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleToSend),
        credentials: 'include',
      });

      if (!res.ok) {
        let errorMessage = `Failed to update role`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse save error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      alert(`Role updated successfully!`);
      router.push('/iam/roles'); // Navigate back to the roles list page
    } catch (err) {
      console.error("Error saving role:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while saving role.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    router.push('/iam/roles'); // Navigate back to the roles list page
  };

  if (loading) {
    return <div className="text-center py-10 text-xl text-blue-600">Loading role details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-xl text-red-600">Error: {error}</div>;
  }

  // If role is not found or invalid ID, you might want to redirect or show a not found message
  if (!editingRole) {
    return <div className="text-center py-10 text-xl text-gray-600">Role not found.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RoleForm
        role={editingRole} // Pass the fetched role data
        allPrivileges={allPrivileges}
        onSave={handleSaveRole}
        onClose={handleCloseForm}
      />
    </div>
  );
}