export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  isApproved: boolean;
  isActive?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
