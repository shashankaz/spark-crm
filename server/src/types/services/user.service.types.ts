export interface FetchUsersInput {
  tenantId: string;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface FetchUserByIdInput {
  tenantId: string;
  id: string;
}

export interface CreateUserInput {
  tenantId: string;
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: string;
}

export interface UpdateUserInput {
  tenantId: string;
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
}

export interface RemoveUserInput {
  tenantId: string;
  id: string;
}
