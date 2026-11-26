import { create } from 'zustand';

export type AppStatus = 'idle' | 'loading' | 'ready' | 'error';

export type SessionUser = {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
};

type AppStore = {
  initialized: boolean;
  status: AppStatus;
  isAuthenticated: boolean;
  user: SessionUser | null;

  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AppStatus) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: SessionUser | null) => void;
  /** Signed out, or the session expired: forget the user but keep `initialized`. */
  clearSession: () => void;

  reset: () => void;
};

const initialState = {
  initialized: false,
  status: 'idle' as AppStatus,
  isAuthenticated: false,
  user: null as SessionUser | null,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,

  setInitialized: (initialized) =>
    set({
      initialized,
    }),

  setStatus: (status) =>
    set({
      status,
    }),

  setAuthenticated: (isAuthenticated) =>
    set({
      isAuthenticated,
    }),

  setUser: (user) => set({ user }),

  clearSession: () => set({ isAuthenticated: false, user: null }),

  reset: () => set(initialState),
}));
