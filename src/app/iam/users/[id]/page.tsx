// // src/app/(iam)/users/[id]/page.tsx
// "use client"; // If you need client-side interactivity like the inline editing

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation'; // For Next.js App Router navigation
// import UserDetailsPage from '@/components/users/UserDetailsPage'; // Your existing UserDetailsPage component
// import { UserResponseDTO } from '@/type/user'; // Your user DTO

// interface UserDetailsRouteParams {
//   id: string; // The ID from the URL will be a string
// }

// interface UserDetailsProps {
//   params: UserDetailsRouteParams;
// }

// export default function SingleUserDetailsPage({ params }: UserDetailsProps) {
//   const router = useRouter();
//   const userId = parseInt(params.id, 10); // Parse the ID from the URL
//   const [user, setUser] = useState<UserResponseDTO | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Function to fetch a single user's details
//   const fetchUserDetails = useCallback(async (id: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch(`http://localhost:8080/iam/users/${id}`, { // Fetch by ID
//         method: 'GET',
//         credentials: 'include',
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || `Failed to fetch user ${id}`);
//       }

//       const data: UserResponseDTO = await res.json();
//       setUser(data);
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (userId) { // Ensure userId is valid before fetching
//       fetchUserDetails(userId);
//     }
//   }, [userId, fetchUserDetails]);

//   // const handleSaveUserDetails = async (updatedUser: UserResponseDTO) => {
//   //   // Implement API call to update user details
//   //   try {

//   //     console.log(updatedUser);

//   //     setLoading(true);
//   //     const res = await fetch(`http://localhost:8080/iam/users/${updatedUser.id}`, {
//   //       method: 'PUT', 
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(updatedUser),
//   //       credentials: 'include',
//   //     });

//   //     if (!res.ok) {
//   //       const errorData = await res.json();
//   //       throw new Error(errorData.message || 'Failed to update user');
//   //     }

//   //     setUser(updatedUser); // Update local state
//   //     alert('User updated successfully!');
//   //     // Optionally, navigate back to the list or to a confirmation page
//   //     // router.push('/iam/users');
//   //   } catch (err) {
//   //     console.error("Error saving user details:", err);
//   //     setError(err instanceof Error ? err.message : 'Failed to save user details.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSaveUserDetails = async (updatedUser: UserResponseDTO) => {
//   try {
//     const updatePayload = {
//       fullName: updatedUser.fullName,
//       date_of_Birth: updatedUser.date_of_Birth,
//       email: updatedUser.email,
//       address: updatedUser.address,
//       gender: updatedUser.gender,
//       phone: updatedUser.phone,
//       status: updatedUser.status,
//       roleId: updatedUser.roleId ?? updatedUser.roles[0]?.roleId, // fallback
//     };

//     const res = await fetch(`http://localhost:8080/iam/users/${updatedUser.id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatePayload),
//       credentials: 'include',
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || 'Failed to update user');
//     }

//     setUser(updatedUser);
//     alert('User updated successfully!');
//   } catch (err) {
//     console.error("Error saving user details:", err);
//     setError(err instanceof Error ? err.message : 'Failed to save user details.');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleCancelUserDetails = () => {
//     router.back(); // Go back to the previous page (user list)
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading user details...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-500">Error: {error}</div>;
//   }

//   if (!user) {
//     return <div className="text-center py-8 text-gray-500">User not found.</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-sm text-gray-500 mb-4">IAM / Users / {user.fullName}</div>
//       <UserDetailsPage
//         user={user}
//         onSave={handleSaveUserDetails}
//         onCancel={handleCancelUserDetails}
//       />
//     </div>
//   );
// }

// src/app/(iam)/users/[id]/page.tsx
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

  function crawlObject(obj: any, prefix = '') {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        crawlObject(value, path); // Recursively crawl nested object
      } else {
        console.log(`${path}: ${value}`);
      }
    }
  }
}


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

      crawlObject(data);

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
      dateOfBirth: updatedUser.dateOfBirth,
      email: updatedUser.email,
      address: updatedUser.address,
      gender: updatedUser.gender,
      phone: updatedUser.phone,
      status: updatedUser.status,
      roleId: updatedUser.roleId,
    };

    console.log("Sending payload to backend:", updatePayload);

    const res = await fetch(`http://localhost:8080/iam/users/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
      credentials: 'include',
    });

    if (!res.ok) {
      // Handle backend errors (e.g., 400, 500)
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

    // --- FIX FOR 204 No Content ---
    if (res.status === 204) {

      await fetchUserDetails(userId);
    } else {
      await fetchUserDetails(userId); // Re-fetch regardless, to be safe
    }
    // --- END FIX ---

    alert('User updated successfully!');
  } catch (err) {
    console.error("Error saving user details:", err);
    setError(err instanceof Error ? err.message : 'Failed to save user details.');
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
      <UserDetailsPage
        user={user}
        onSave={handleSaveUserDetails}
        onCancel={handleCancelUserDetails}
      />
    </div>
  );
}