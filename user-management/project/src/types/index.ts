export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface AuthResponse {
  token: string;
}

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface UserContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  users: User[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchUsers: (page: number) => Promise<void>;
  updateUser: (id: number, data: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}