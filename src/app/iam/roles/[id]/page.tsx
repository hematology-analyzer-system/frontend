import RoleEditClient from './RoleEditClient';

export default async function RoleEditPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const roleId = parseInt(id, 10);
  return <RoleEditClient roleId={roleId} />;
}

// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import RoleForm from '@/components/Form/RoleForm';
// import { RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';
// import toast from 'react-hot-toast';

// interface RoleEditPageProps {
//   params: { id: string };
// }

// export default function RoleEditPage({ params }: RoleEditPageProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   // ================================================================
//   // ADDED: Logic to determine if the page is in read-only mode
//   // ================================================================
//   const mode = searchParams.get('mode') || 'edit'; // Default to 'edit' if no mode is specified
//   const isReadOnly = mode === 'view';

//   const roleId = parseInt(params.id, 10);
//   const [editingRole, setEditingRole] = useState<RoleResponseDTO | null>(null);
//   const [allPrivileges, setAllPrivileges] = useState<PrivilegeResponseDTO[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRoleById = useCallback(async (id: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`https://fhard.khoa.email/api/iam/roles/${id}`, {
//         method: 'GET',
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         let errorMessage = `Failed to fetch role with ID ${id}`;
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (jsonError) {
//           console.error("Failed to parse error response:", jsonError);
//         }
//         throw new Error(errorMessage);
//       }

//       const data: RoleResponseDTO = await res.json();
      
//       setEditingRole(data);
//     } catch (err) {
//       console.error(`Error fetching role ${id}:`, err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
//       setEditingRole(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchAllPrivileges = useCallback(async () => {
//     try {
//       const res = await fetch(`https://fhard.khoa.email/api/iam/privileges`, {
//         method: 'GET',
//         credentials: 'include',
//       });
//       if (!res.ok) {
//         let errorMessage = 'Failed to fetch privileges';
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (jsonError) {
//           console.error("Failed to parse privilege error response:", jsonError);
//         }
//         throw new Error(errorMessage);
//       }
//       const data: PrivilegeResponseDTO[] = await res.json();
//       setAllPrivileges(data);
//     } catch (err) {
//       console.error("Error fetching privileges:", err);
//     }
//   }, []);

//   useEffect(() => {
//     if (roleId && !isNaN(roleId)) {
//       fetchRoleById(roleId);
//       fetchAllPrivileges();
//     } else {
//       setError("Invalid Role ID provided.");
//       setLoading(false);
//     }
//   }, [roleId, fetchRoleById, fetchAllPrivileges]);

//   const handleSaveRole = async (roleData: RoleResponseDTO) => {
//     setLoading(true);
//     try {
//       const url = `https://fhard.khoa.email/api/iam/roles/${roleData.roleId}`;

//       const privilegesIdsForBackend = roleData.privileges.map(p => p.privilegeId);

//       const roleToSend = {
//           roleId: roleData.roleId,
//           name: roleData.name,
//           code: roleData.code,
//           description: roleData.description,
//           privilegesIds: privilegesIdsForBackend,
//       };

//       const res = await fetch(url, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(roleToSend),
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         let errorMessage = `Failed to update role`;
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (jsonError) {
//           console.error("Failed to parse save error response:", jsonError);
//         }
//         throw new Error(errorMessage);
//       }

//       toast.success(`Role updated successfully!`);
//       router.push('/iam/roles');
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred while saving role.');
//       toast.error('Failed to update role.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseForm = () => {
//     router.push('/iam/roles');
//   };

//   if (loading) {
//     return <div className="text-center py-10 text-xl text-blue-600">Loading role details...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-xl text-red-600">Error: {error}</div>;
//   }

//   if (!editingRole) {
//     return <div className="text-center py-10 text-xl text-gray-600">Role not found.</div>;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
//         {/* ================================================================ */}
//         {/* MODIFIED: The heading now reflects the mode (View or Edit) */}
//         {/* ================================================================ */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           {isReadOnly ? `View Role: ${editingRole.name}` : `Edit Role: ${editingRole.name}`}
//         </h2>
//         {/* ================================================================ */}
//         {/* MODIFIED: Pass isReadOnly prop and conditionally pass onSave */}
//         {/* The RoleForm component will need to be updated to handle this prop. */}
//         {/* ================================================================ */}
//         <RoleForm
//           role={editingRole}
//           allPrivileges={allPrivileges}
//           onSave={!isReadOnly ? handleSaveRole : undefined} // Only pass onSave if not in read-only mode
//           onClose={handleCloseForm}
//           isReadOnly={isReadOnly}
//         />
//       </div>
//     </div>
//   );
// }

// // "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import RoleForm from '@/components/Form/RoleForm';
// import { RoleResponseDTO, PrivilegeResponseDTO } from '@/type/user';
// import toast from 'react-hot-toast';

// // ================================================================
// // CORRECTION: Update the prop types to handle Promise-based params
// // ================================================================
// interface RoleEditPageProps {
//   params: { id: string };
// }

// // ================================================================
// // CORRECTION: The component must be an async function to await params
// // ================================================================
// export default function RoleEditPage({ params }: RoleEditPageProps) {
//   // // Await the params object to get the actual value
//   // const resolvedParams = await params;

//   // // Added a check for resolvedParams to ensure it's not null or undefined
//   // if (!resolvedParams || !resolvedParams.id) {
//   //   return <div className="text-center py-10 text-xl text-red-600">Error: Invalid route parameters.</div>;
//   // }
//   const roleId = parseInt(params.id, 10);

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // ================================================================
//   // ADDED: Logic to determine if the page is in read-only mode
//   // ================================================================
//   const mode = searchParams.get('mode') || 'edit'; // Default to 'edit' if no mode is specified
//   const isReadOnly = mode === 'view';

//   // const roleId = parseInt(resolvedParams.id, 10);
//   const [editingRole, setEditingRole] = useState<RoleResponseDTO | null>(null);
//   const [allPrivileges, setAllPrivileges] = useState<PrivilegeResponseDTO[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRoleById = useCallback(async (id: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`https://fhard.khoa.email/api/iam/roles/${id}`, {
//         method: 'GET',
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         let errorMessage = `Failed to fetch role with ID ${id}`;
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (jsonError) {
//           console.error("Failed to parse error response:", jsonError);
//         }
//         throw new Error(errorMessage);
//       }

//       const data: RoleResponseDTO = await res.json();

//       setEditingRole(data);
//     } catch (err) {
//       console.error(`Error fetching role ${id}:`, err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
//       setEditingRole(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchAllPrivileges = useCallback(async () => {
//     try {
//       const res = await fetch(`https://fhard.khoa.email/api/iam/privileges`, {
//         method: 'GET',
//         credentials: 'include',
//       });
//       if (!res.ok) {
//         let errorMessage = 'Failed to fetch privileges';
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (jsonError) {
//           console.error("Failed to parse privilege error response:", jsonError);
//         }
//         throw new Error(errorMessage);
//       }
//       const data: PrivilegeResponseDTO[] = await res.json();
//       setAllPrivileges(data);
//     } catch (err) {
//       console.error("Error fetching privileges:", err);
//     }
//   }, []);

//   useEffect(() => {
//     console.log("roleId from resolvedParams:", roleId); // 👀
//     if (roleId && !isNaN(roleId)) {
//       console.log("Fetching role from FE...");
//       fetchRoleById(roleId);
//       fetchAllPrivileges();
//     } else {
//       console.warn("Invalid Role ID:", roleId);
//       setError("Invalid Role ID provided.");
//       setLoading(false);
//     }
//   }, [roleId, fetchRoleById, fetchAllPrivileges]);

//   const handleSaveRole = async (roleData: RoleResponseDTO) => {
//     setLoading(true);
//     try {
//       const url = `https://fhard.khoa.email/api/iam/roles/${roleData.roleId}`;

//       const privilegesIdsForBackend = roleData.privileges.map(p => p.privilegeId);

//       const roleToSend = {
//           roleId: roleData.roleId,
//           name: roleData.name,
//           code: roleData.code,
//           description: roleData.description,
//           privilegesIds: privilegesIdsForBackend,
//       };

//       const res = await fetch(url, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(roleToSend),
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         let errorMessage = `Failed to update role`;
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (jsonError) {
//           console.error("Failed to parse save error response:", jsonError);
//         }
//         throw new Error(errorMessage);
//       }

//       toast.success(`Role updated successfully!`);
//       router.push('/iam/roles');
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred while saving role.');
//       toast.error('Failed to update role.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseForm = () => {
//     router.push('/iam/roles');
//   };

//   if (loading) {
//     return <div className="text-center py-10 text-xl text-blue-600">Loading role details...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-xl text-red-600">Error: {error}</div>;
//   }

//   if (!editingRole) {
//     return <div className="text-center py-10 text-xl text-gray-600">Role not found.</div>;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
//         {/* ================================================================ */}
//         {/* MODIFIED: The heading now reflects the mode (View or Edit) */}
//         {/* ================================================================ */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           {isReadOnly ? `View Role: ${editingRole.name}` : `Edit Role: ${editingRole.name}`}
//         </h2>
//         {/* ================================================================ */}
//         {/* MODIFIED: Pass isReadOnly prop and conditionally pass onSave */}
//         {/* The RoleForm component will need to be updated to handle this prop. */}
//         {/* ================================================================ */}
//         <RoleForm
//           role={editingRole}
//           allPrivileges={allPrivileges}
//           onSave={!isReadOnly ? handleSaveRole : undefined} // Only pass onSave if not in read-only mode
//           onClose={handleCloseForm}
//           isReadOnly={isReadOnly}
//         />
//       </div>
//     </div>
//   );
// }
