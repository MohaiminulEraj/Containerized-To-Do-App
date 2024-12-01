import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/todo';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email: string, password: string) => {
        try {
          const { user } = await authService.login({ email, password });
          set({ user });
        } catch (error) {
          toast.error('Invalid credentials');
          throw error;
        }
      },
      register: async (email: string, password: string, name: string) => {
        try {
          const { user } = await authService.register({ email, password, name });
          set({ user });
        } catch (error) {
          toast.error('Registration failed');
          throw error;
        }
      },
      logout: async () => {
        try {
          await authService.logout();
          set({ user: null });
        } catch (error) {
          toast.error('Logout failed');
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);