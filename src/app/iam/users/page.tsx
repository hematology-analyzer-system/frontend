// // src/app/(iam)/users/page.tsx
// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import UserCard from '@/components/Card/UserCard';
// import Pagination from '@/components/Pagination/Pagination';
// import SearchFilterBar from '@/components/Layout/SearchFilterBar';
// import UserForm from '@/components/Form/UserForm'; // Import the UserForm component
// import { UserResponseDTO, PageResponse, RoleResponseDTO, CreateUserRequest } from '@/type/user';
// import { PlusIcon } from '@heroicons/react/24/outline'; // For the create button icon
// import toast from 'react-hot-toast'; // Import toast

// export default function UsersPage() {
//   const router = useRouter();
//   const [users, setUsers] = useState<UserResponseDTO[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [searchText, setSearchText] = useState<string>('');
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const [totalUsers, setTotalUsers] = useState<number>(0);

//   const [selectedRole, setSelectedRole] = useState<string>('');
//   const [selectedLocation, setSelectedLocation] = useState<string>('');
//   const [selectedSort, setSelectedSort] = useState<string>('A - Z');

//   const limitOnePage = 12;

//   const sortBy = 'fullName';
//   const direction = selectedSort === 'Z - A' ? 'desc' : 'asc';

//   // State for the user creation form
//   const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
//   const [allRoles, setAllRoles] = useState<RoleResponseDTO[]>([]);
//   const [rolesLoading, setRolesLoading] = useState(true);
//   const [rolesError, setRolesError] = useState<string | null>(null);

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const params = new URLSearchParams({
//       searchText: searchText || '',
//       sortBy: sortBy,
//       direction: direction,
//       offsetPage: currentPage.toString(),
//       limitOnePage: limitOnePage.toString(),
//       ...(selectedRole && { role: selectedRole }),
//       ...(selectedLocation && { location: selectedLocation }),
//     });

//     try {
//       const url = `http://localhost:8080/iam/users/filter?${params.toString()}`;
//       console.log("fetching: ", url);
//       const options: RequestInit = {
//         method: 'GET',
//         credentials: 'include',
//       };

//       const res = await fetch(url, options);

//       if (!res.ok) {
//         let errorMessage = 'Failed to fetch users';
//         try {
//           const contentType = res.headers.get("content-type");
//           if (contentType && contentType.includes("application/json")) {
//             const errorData = await res.json();
//             errorMessage = errorData.message || errorMessage;
//           } else {
//             const errorText = await res.text();
//             errorMessage = errorText || errorMessage;
//           }
//         } catch (e) {
//           console.warn("Error parsing error response:", e);
//         }
//         throw new Error(errorMessage);
//       }

//       const data: PageResponse<UserResponseDTO> = await res.json();

//       setUsers(data.content);
//       setTotalPages(data.totalPages);
//       setTotalUsers(data.totalElements);

//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   }, [searchText, selectedRole, selectedLocation, selectedSort, currentPage]);

//   const fetchAllRoles = useCallback(async () => {
//     setRolesLoading(true);
//     setRolesError(null);
//     try {
//       const res = await fetch('http://localhost:8080/iam/roles', {
//         method: 'GET',
//         credentials: 'include',
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to fetch roles');
//       }
//       const data: RoleResponseDTO[] = await res.json();
//       setAllRoles(data);
//     } catch (err) {
//       console.error("Error fetching roles:", err);
//       setRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching roles.');
//     } finally {
//       setRolesLoading(false);
//     }
//   }, []);


//   useEffect(() => {
//     fetchUsers();
//     fetchAllRoles(); // Fetch roles when the component mounts
//   }, [fetchUsers, fetchAllRoles]);

//   const handleSearchChange = (text: string) => {
//     setSearchText(text);
//     setCurrentPage(1);
//   };

//   const handleRoleChange = (role: string) => {
//     setSelectedRole(role);
//     setCurrentPage(1);
//   };

//   const handleLocationChange = (location: string) => {
//     setSelectedLocation(location);
//     setCurrentPage(1);
//   };

//   const handleSortChange = (sort: string) => {
//     setSelectedSort(sort);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleViewUser = (userId: number) => {
//     router.push(`/iam/users/${userId}`);
//   };

//   const handleEditUser = (userId: number) => {
//     console.log(`Edit user with ID: ${userId}`);
//     router.push(`/iam/users/${userId}?mode=edit`);
//   };

//   const handleDeleteUser = async (userId: number) => {
//     if (!window.confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(`http://localhost:8080/iam/users/${userId}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to delete user');
//       }

//       fetchUsers();
//       toast.success('User deleted successfully!'); // Use toast
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       setError(err instanceof Error ? err.message : 'Failed to delete user.');
//       toast.error('Failed to delete user.'); // Use toast
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateNewUserClick = () => {
//     setIsCreateFormOpen(true);
//   };

//   const handleSaveNewUser = async (userData: CreateUserRequest) => {
//     setLoading(true); // Indicate loading for the main page during form submission
//     setError(null); // Clear any previous errors

//     try {
//       const res = await fetch('http://localhost:8080/iam/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(userData),
//       });

//       // Attempt to parse JSON regardless of res.ok status to get error details
//       const responseData = await res.json();
//       console.log("Response status:", res.status);
//       console.log("Request payload (userData):", userData);
//       console.log("Full response data (errorData/successData):", responseData);

//       if (!res.ok) {
//         // Construct an error object that the catch block can understand
//         const errorToThrow: any = new Error(responseData.message || "User creation failed");
//         errorToThrow.response = { data: responseData }; // Attach the response data for error handling
//         throw errorToThrow;
//       }

//       // If the request was successful
//       toast.success('User created successfully!');
//       setIsCreateFormOpen(false); // Close the form ONLY on success
//       fetchUsers(); // Re-fetch users to update the list
//     } catch (err: any) {
//       console.error("Error caught in handleSaveNewUser:", err);
//       const errorData = err.response?.data; // Use optional chaining to access data from the thrown error

//       const newFieldErrors: { [key: string]: string } = {};

//       if (errorData && Array.isArray(errorData.error) && errorData.error.length > 0) {
//         // This handles the backend's `duplicateFields` array
//         for (const field of errorData.error) {
//           if (field === 'email') newFieldErrors.email = "This email is already registered.";
//           else if (field === 'phone') newFieldErrors.phone = 'This phone number is already registered.';
//           else if (field === 'identify') newFieldErrors.identifyNum = 'This identity number is already registered.';
//         }
//         // Attach field errors to the main error object before re-throwing for UserForm
//         err.fieldErrors = newFieldErrors;
//         toast.error("Registration failed due to duplicate information.");
//       } else if (errorData?.message) {
//         // General message from backend
//         toast.error(errorData.message);
//       } else {
//         // Network error or client-side thrown error without specific backend message
//         toast.error(err.message || 'An unknown error occurred during user creation.');
//       }
      
//       // IMPORTANT: Only close the form if the error is NOT a fieldError.
//       // UserForm is responsible for handling and displaying fieldErrors itself.
//       if (!err.fieldErrors || Object.keys(err.fieldErrors).length === 0) {
//         setIsCreateFormOpen(false); // Close form for general errors or non-field-specific issues
//       }

//       throw err; // Re-throw so UserForm can catch and display field errors if present
//     } finally {
//       setLoading(false); // Stop loading indicator
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-sm text-gray-500 mb-4">IAM / Users</div>
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Users Management</h1>

//       {/* Search and Filter Bar */}
//       <SearchFilterBar
//         searchText={searchText}
//         onSearchChange={handleSearchChange}
//         selectedSort={selectedSort}
//         onSortChange={handleSortChange}
//       />

//       {/* Create New User Button - Moved below the SearchFilterBar */}
//       <div className="flex justify-end mb-6 mt-4"> {/* Added mt-4 for spacing */}
//         <button
//           onClick={handleCreateNewUserClick}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" /> Create New User
//         </button>
//       </div>

//       {loading && <div className="text-center py-8 text-blue-500">Loading users...</div>}
//       {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}
//       {!loading && !error && users.length === 0 && (
//         <div className="text-center py-8 text-gray-500">No users found.</div>
//       )}

//       {!loading && !error && users.length > 0 && (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {users.map((user) => (
//               <UserCard
//                 key={user.id}
//                 user={user}
//                 onView={handleViewUser}
//                 onEdit={handleEditUser}
//                 onDelete={handleDeleteUser}
//               />
//             ))}
//           </div>
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </>
//       )}

//       {isCreateFormOpen && (
//         <UserForm
//           user={null} // Null for creation
//           allRoles={allRoles}
//           rolesLoading={rolesLoading}
//           rolesError={rolesError}
//           onSave={handleSaveNewUser} // This will handle the POST request
//           onClose={() => setIsCreateFormOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// src/app/(iam)/users/page.tsx
"use client";

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '@/components/Card/UserCard';
import Pagination from '@/components/Pagination/Pagination';
import SearchFilterBar from '@/components/Layout/SearchFilterBar';
import UserForm from '@/components/Form/UserForm';
import { UserResponseDTO, PageResponse, RoleResponseDTO, CreateUserRequest } from '@/type/user';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useNotification } from '@/context/NotificationContext';

export default function UsersPage() {
  const router = useRouter();
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

  const sortBy = 'fullName';
  const direction = selectedSort === 'Z - A' ? 'desc' : 'asc';

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [allRoles, setAllRoles] = useState<RoleResponseDTO[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // ================================================================
  // MODIFIED: Fetch currentUserPrivileges from localStorage
  // ================================================================
  const [currentUserPrivileges, setCurrentUserPrivileges] = useState<number[]>([]);

  useEffect(() => {
    // This effect runs once on component mount to get privileges from localStorage
    if (typeof window !== 'undefined') {
      try {
        const privilegesString = localStorage.getItem('privilege_ids');
        if (privilegesString) {
          const privilegeIds: number[] = JSON.parse(privilegesString);
          setCurrentUserPrivileges(privilegeIds);
        }
      } catch (error) {
        console.error("Failed to parse privilege_ids from localStorage:", error);
      }
    }
  }, []);

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
      const url = `http://localhost:8080/iam/users/filter?${params.toString()}`;
      console.log("fetching: ", url);
      const options: RequestInit = {
        method: 'GET',
        credentials: 'include',
      };

      const res = await fetch(url, options);

      if (!res.ok) {
        let errorMessage = 'Failed to fetch users';
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } else {
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

  const fetchAllRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const res = await fetch('http://localhost:8080/iam/roles', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch roles');
      }
      const data: RoleResponseDTO[] = await res.json();
      setAllRoles(data);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setRolesError(err instanceof Error ? err.message : 'An unknown error occurred while fetching roles.');
    } finally {
      setRolesLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchUsers();
    fetchAllRoles();
  }, [fetchUsers, fetchAllRoles]);

  const { setNotifications } = useNotification();

  useEffect(() => {
    // Setup WebSocket connection and subscribe to /topic/userCreated and /topic/userLocked
    const socket = new SockJS('http://localhost:8080/iam/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe('/topic/userCreated', (message) => {
          if (message.body) {
            const user = JSON.parse(message.body);
            setNotifications((prev: any) => [
              ...prev,
              {
                id: Date.now(),
                message: `New user "${user.fullName}" created!`,
                timestamp: new Date().toLocaleString(),
              },
            ]);
          }
        });
        stompClient.subscribe('/topic/userDeleted', (message) => {
          // The backend sends a UserAuditLog object
          if (message.body) {
            try {
              const auditLog = JSON.parse(message.body);
              const userName = auditLog.fullName || auditLog.details || 'A user';
              setNotifications((prev: any) => [
                ...prev,
                {
                  id: Date.now(),
                  message: `User "${userName}" has been deleted!`,
                  timestamp: new Date().toLocaleString(),
                },
              ]);
              // Refresh the user list to reflect the deletion
              fetchUsers();
            } catch (e) {
              setNotifications((prev: any) => [
                ...prev,
                {
                  id: Date.now(),
                  message: 'A user has been deleted.',
                  timestamp: new Date().toLocaleString(),
                },
              ]);
              // Refresh the user list even if parsing fails
              fetchUsers();
            }
          }
        });
        // stompClient.subscribe('/topic/userLocked', (message) => {
        //   // The backend sends a UserAuditLog object
        //   if (message.body) {
        //     try {
        //       const auditLog = JSON.parse(message.body);
        //       const userName = auditLog.fullName || auditLog.details || 'A user';
        //       setNotifications((prev: any) => [
        //         ...prev,
        //         {
        //           id: Date.now(),
        //           message: `User "${userName}" has been locked!`,
        //           timestamp: new Date().toLocaleString(),
        //         },
        //       ]);
        //     } catch (e) {
        //       setNotifications((prev: any) => [
        //         ...prev,
        //         {
        //           id: Date.now(),
        //           message: 'A user has been locked.',
        //           timestamp: new Date().toLocaleString(),
        //         },
        //       ]);
        //     }
        //   }
        // });
        // stompClient.subscribe('/topic/userUnlocked', (message) => {
        //   // The backend sends a UserAuditLog object
        //   if (message.body) {
        //     try {
        //       const auditLog = JSON.parse(message.body);
        //       const userName = auditLog.fullName || auditLog.details || 'A user';
        //       setNotifications((prev: any) => [
        //         ...prev,
        //         {
        //           id: Date.now(),
        //           message: `User "${userName}" has been unlocked!`,
        //           timestamp: new Date().toLocaleString(),
        //         },
        //       ]);
        //     } catch (e) {
        //       setNotifications((prev: any) => [
        //         ...prev,
        //         {
        //           id: Date.now(),
        //           message: 'A user has been unlocked.',
        //           timestamp: new Date().toLocaleString(),
        //         },
        //       ]);
        //     }
        //   }
        // });
      },
    });
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, [setNotifications]);

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

  const handleViewUser = (userId: number) => {
    router.push(`/iam/users/${userId}`);
  };

  const handleEditUser = (userId: number) => {
    console.log(`Edit user with ID: ${userId}`);
    router.push(`/iam/users/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    // IMPORTANT: Replaced `window.confirm` with a custom modal in a real app.
    // For this example, we'll keep the prompt but note the change.
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

      fetchUsers();
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err instanceof Error ? err.message : 'Failed to delete user.');
      toast.error('Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewUserClick = () => {
    setIsCreateFormOpen(true);
  };

  const handleSaveNewUser = async (userData: CreateUserRequest) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8080/iam/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const responseData = await res.json();
      console.log("Response status:", res.status);
      console.log("Request payload (userData):", userData);
      console.log("Full response data (errorData/successData):", responseData);

      if (!res.ok) {
        const errorToThrow: any = new Error(responseData.message || "User creation failed");
        errorToThrow.response = { data: responseData };
        throw errorToThrow;
      }

      toast.success('User created successfully!');
      setIsCreateFormOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Error caught in handleSaveNewUser:", err);
      const errorData = err.response?.data;

      const newFieldErrors: { [key: string]: string } = {};

      if (errorData && Array.isArray(errorData.error) && errorData.error.length > 0) {
        for (const field of errorData.error) {
          if (field === 'email') newFieldErrors.email = "This email is already registered.";
          else if (field === 'phone') newFieldErrors.phone = 'This phone number is already registered.';
          else if (field === 'identify') newFieldErrors.identifyNum = 'This identity number is already registered.';
        }
        err.fieldErrors = newFieldErrors;
        toast.error("Registration failed due to duplicate information.");
      } else if (errorData?.message) {
        toast.error(errorData.message);
      } else {
        toast.error(err.message || 'An unknown error occurred during user creation.');
      }
      
      if (!err.fieldErrors || Object.keys(err.fieldErrors).length === 0) {
        setIsCreateFormOpen(false);
      }

      throw err;
    } finally {
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
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
      />

      {currentUserPrivileges.includes(14) && (
        <div className="flex justify-end mb-6 mt-4">
          <button
            onClick={handleCreateNewUserClick}
            className="button w-auto text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-100 ease-in-out flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Create New User
          </button>
        </div>
      )}

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
                onView={handleViewUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                currentUserPrivileges={currentUserPrivileges}
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

      {isCreateFormOpen && (
        <UserForm
          user={null}
          allRoles={allRoles}
          rolesLoading={rolesLoading}
          rolesError={rolesError}
          onSave={handleSaveNewUser}
          onClose={() => setIsCreateFormOpen(false)}
        />
      )}
    </div>
  );
}
