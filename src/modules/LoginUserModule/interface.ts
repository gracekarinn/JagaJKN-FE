export interface User {
  id: number;
  nik: string;
  namaLengkap: string;
  noTelp: string;
  email?: string;
}

export interface LoginResponse {
  status: string;
  message?: string;
  token: string;
  user: User;
}

export interface ApiError {
  status: string;
  message: string;
  details?: string;
}

export interface ApiResponse {
  status: string;
  user: User;
}
