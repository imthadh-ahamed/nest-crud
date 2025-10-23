export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
}
