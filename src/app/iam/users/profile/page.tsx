"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  ClockIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// Define the PrivilegeResponseDTO interface.
interface PrivilegeResponseDTO {
  privilegeId: number;
  code: string;
  name: string;
}

// Updated UserResponseDTO to include the privileges property.
interface UserResponseDTO {
  id: number;
  fullName: string;
  date_of_Birth: string | null;
  email: string;
  address: string | null;
  gender: string | null;
  phone: string | null;
  identifyNum: string | null;
  roleIds: number[];
  status: string;
  profileImageUrl: string | null;
  updateAt: string | null;
  updated_by_email: string | null;
  createAt: string | null;
  privileges?: PrivilegeResponseDTO[];
}

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Get the userId from local storage.
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const currentUserId = storedUserId ? Number(storedUserId) : null;

  const fetchUserDetails = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://fhard.khoa.email/api/iam/users/${id}`, {
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
    if (currentUserId && !isNaN(currentUserId) && currentUserId > 0) {
      fetchUserDetails(currentUserId);
    } else {
      setLoading(false);
      setError('User ID not found in local storage. Please log in again.');
    }
  }, [currentUserId, fetchUserDetails]);

  const handleNavigateToChangePassword = () => {
    // Navigate to the new change-password page.
    // Assuming the route is /iam/users/profile/change-password
    router.push('/iam/users/profile/change-password');
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-500">User profile not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">Profile</div>
      {feedback && (
        <div
          className={`mb-4 p-4 rounded-md ${
            feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          <p>{feedback.message}</p>
        </div>
      )}
      <ProfileDetails user={user} onChangePassword={handleNavigateToChangePassword} />
    </div>
  );
}

// This component is responsible for rendering the read-only user details.
interface ProfileDetailsProps {
  user: UserResponseDTO;
  onChangePassword: () => void;
}
const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user, onChangePassword }) => {
  const DisplayField: React.FC<{ label: string; value?: string | null; icon: React.ElementType; className?: string; }> = ({ label, value, icon: Icon, className }) => (
    <div className={`mb-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md py-2 px-3 text-gray-700 text-sm">
        <Icon className="h-5 w-5 mr-2 text-gray-500" />
        <p>{value || 'N/A'}</p>
      </div>
    </div>
  );

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      };
      return date.toLocaleString('en-GB', options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid Date';
    }
  };

  const userPrivilegeCodes = (user.privileges ?? [])
    .map(p => p.code)
    .join(', ') || 'N/A';

  const displayedRoleNames = (user.roleIds ?? [])
    .map(id => `Role ID: ${id}`)
    .join(', ') || 'N/A';

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <div className="mb-6 border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="mt-1 text-sm text-gray-600">View your personal details and account information.</p>
        </div>
        <button
          onClick={onChangePassword}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Change Password
        </button>
      </div>
      <div className="md:col-span-2 flex items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mr-4 border-4 border-blue-100 flex-shrink-0">
          <img
            src={
              user.profileImageUrl ||
              `https://placehold.co/96x96/ADD8E6/000000?text=${user.fullName?.charAt(0) ?? 'U'}`
            }
            alt={user.fullName ?? 'User'}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-800">{user.fullName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
        <DisplayField label="Full Name" value={user.fullName} icon={UserIcon} />
        <DisplayField label="Email address" value={user.email} icon={EnvelopeIcon} />
        <DisplayField label="Phone number" value={user.phone} icon={PhoneIcon} />
        <DisplayField label="Gender" value={user.gender} icon={UserIcon} />
        <DisplayField label="Date of Birth" value={user.date_of_Birth} icon={CalendarDaysIcon} />
        <DisplayField label="Address" value={user.address} icon={MapPinIcon} />
        <DisplayField label="Identify Number" value={user.identifyNum} icon={IdentificationIcon} />
        <DisplayField label="Status" value={user.status} icon={ShieldCheckIcon} />
        <DisplayField label="Roles" value={displayedRoleNames} icon={TagIcon} />
        <DisplayField label="Privileges" value={userPrivilegeCodes} icon={TagIcon} />
      </div>
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Timestamps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <DisplayField label="Created At" value={formatTimestamp(user.createAt)} icon={ClockIcon} />
          <DisplayField label="Last Updated At" value={formatTimestamp(user.updateAt)} icon={ClockIcon} />
        </div>
      </div>
    </div>
  );
};
