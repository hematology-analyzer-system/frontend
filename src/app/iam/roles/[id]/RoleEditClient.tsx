'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RoleForm from '@/components/Form/RoleForm';
import { RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';
import toast from 'react-hot-toast';

interface Props {
  roleId: number;
}

export default function RoleEditClient({ roleId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'edit';
  const isReadOnly = mode === 'view';

  const [editingRole, setEditingRole] = useState<RoleResponseDTO | null>(null);
  const [allPrivileges, setAllPrivileges] = useState<PrivilegeResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoleById = useCallback(async (id: number) => {
    try {
      const res = await fetch(`https://fhard.khoa.email/api/iam/roles/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Failed to fetch role ${id}`);
      }

      const data: RoleResponseDTO = await res.json();
      setEditingRole(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching role');
      setEditingRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllPrivileges = useCallback(async () => {
    try {
      const res = await fetch(`https://fhard.khoa.email/api/iam/privileges`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to fetch privileges');
      }

      const data: PrivilegeResponseDTO[] = await res.json();
      setAllPrivileges(data);
    } catch (err) {
      console.error('Privilege fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchRoleById(roleId);
    fetchAllPrivileges();
  }, [roleId, fetchRoleById, fetchAllPrivileges]);

  const handleSaveRole = async (roleData: RoleResponseDTO) => {
    setLoading(true);
    try {
      const url = `https://fhard.khoa.email/api/iam/roles/${roleData.roleId}`;
      const roleToSend = {
        ...roleData,
        privilegesIds: roleData.privileges.map(p => p.privilegeId),
      };

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleToSend),
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update role');
      }

      toast.success('Role updated successfully!');
      router.push('/iam/roles');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    router.push('/iam/roles');
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error: {error}</p>;
  if (!editingRole) return <p className="text-center py-10">Role not found.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">
          {isReadOnly ? `View Role: ${editingRole.name}` : `Edit Role: ${editingRole.name}`}
        </h2>
        <RoleForm
          role={editingRole}
          allPrivileges={allPrivileges}
          onSave={!isReadOnly ? handleSaveRole : undefined}
          onClose={handleCloseForm}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}
