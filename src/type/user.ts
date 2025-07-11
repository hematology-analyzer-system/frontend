// types/user.ts

export interface UserResponseDTO {
  id: number; // Ensure ID is included for actions
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  status: string; // e.g., "ACTIVE", "INACTIVE"
  createdAt?: string; // from user.getCreate_at()
  updatedAt?: string; // from user.getUpdate_at()
  roles: string[]; // Set of role names (mapped from User.getRoles())
  privileges: string[]; // Set of privilege descriptions (mapped from User.getRoles().getPrivileges())

  profileImageUrl?: string;
}

// ... PageResponse interface remains the same
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}