export interface UserResponseDTO {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  date_of_Birth?: string;
  identifyNum: string;
  status: string;
  createdAt?: string;
  updateAt?: string;
  updated_by_email?: string;
  privileges: string[]; // This might still be used for displaying user privileges, separate from role-specific privileges
  profileImageUrl?: string;
  roleIds ?: number[];
  roles?: RoleResponseDTO[]; // This is used when fetching roles with user data, for UserDetailsPage
  enabled?: boolean;
  credentialsNonExpired?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  authorities?: string[];
}

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
    privileges: PrivilegeResponseDTO[]; // This should be an array of PrivilegeResponseDTO objects
    createdBy?: UserAuditInfoDTO;
    updatedBy?: UserAuditInfoDTO;
}

export interface PrivilegeResponseDTO {
    privilegeId: number;
    code: string; // e.g., "VIEW_USER", "CREATE_USER"
    description: string; // e.g., "View users", "Create user"
}

export interface RoleRequest {
  page_num: number;
  page_size: number;
  filter?: string;
  sort?: string;
}

export interface PageResponseRole {
    roles: RoleResponseDTO[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    sortBy: string;
    sortDirection: string;
    empty: boolean;
    message: string;
}

export interface CreateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    identifyNum: string;
    address?: string;
    gender?: string;
    password?: string; // This should ideally be handled securely, maybe generated or set after creation
    date_of_Birth: string; // YYYY-MM-DD format expected
    roleIds: number[];
}