import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  
  setUser: (user, token) => set({ user, token }),
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    }
  }
}));
