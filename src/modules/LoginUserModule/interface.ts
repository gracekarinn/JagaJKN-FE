export interface LoginResponse {
  accessToken: string;
  user: {
    nik: string;
    name: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}
