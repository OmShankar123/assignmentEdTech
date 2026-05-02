export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: {
    url: string;
    localPath: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

export interface RegisterResponse {
  data: User;
  message: string;
  success: boolean;
}
