import { api } from './api';
import { API_ENDPOINTS } from '../config/api.config';
import { User } from '../types/todo';

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, credentials);
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(API_ENDPOINTS.auth.register, credentials);
    localStorage.setItem('auth_token', data.token);
    return data;
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.auth.logout);
    localStorage.removeItem('auth_token');
  },
};