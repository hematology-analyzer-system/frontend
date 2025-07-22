// types/user.ts

export interface UserResponseDTO {
  id: number; // Ensure ID is included for actions
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  dateOfBirth?: string;
  status: string; // e.g., "ACTIVE", "INACTIVE", "PENDING_VERIFICATION"
  createdAt?: string; // from user.getCreate_at()
  updateAt?: string; // from user.getUpdate_at()
  // roles: string[]; // Set of role names (mapped from User.getRoles())
  privileges: string[]; // Set of privilege descriptions (mapped from User.getRoles().getPrivileges())

  profileImageUrl?: string;

  roleId ?: number[];
  roles: RoleResponseDTO[]; // Updated to be an array of RoleResponseDTO
    enabled?: boolean;
    credentialsNonExpired?: boolean;
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    authorities?: string[]; // Assuming simple string array for authorities
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

export interface UserAuditInfoDTO {
    userId: number;
    fullName: string;
    email: string;
    identifyNum: string;
}

export interface RoleResponseDTO {
    roleId: number;
    name: string;
    description: string;
    code: string;
    privileges: PrivilegeResponseDTO[];
    createdBy?: UserAuditInfoDTO;
    updatedBy?: UserAuditInfoDTO;
}

export interface PrivilegeResponseDTO {
    privilegeId: number;
    code: string;
    description: string;
}

export interface RoleRequest {
  page_num: number;
  page_size: number;
  filter?: string; // Corresponds to keyword in backend's searchRoles
  sort?: string;   // Corresponds to sortBy in backend's searchRoles
  // Add other fields if your backend's RoleRequest accepts them for more filters
  // For example:
  // roleName?: string;
  // location?: string;
}

export interface PageResponseRole {
    roles: RoleResponseDTO[]; // 🚨 Changed 'content' to 'roles'
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    sortBy: string;
    sortDirection: string;
    empty: boolean;
    message: string; // Add message if present in backend response
    // Remove 'content' if it's not actually present
    // content: T[]; // Remove this line if 'roles' is the actual array field
}