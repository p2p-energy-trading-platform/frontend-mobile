import { create } from 'zustand';

export type AppStatus = 'idle' | 'loading' | 'ready' | 'error';

type AppStore = {
  initialized: boolean;
  status: AppStatus;
  isAuthenticated: boolean;

  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AppStatus) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;

  reset: () => void;
};

const initialState = {
  initialized: false,
  status: 'idle' as AppStatus,
  isAuthenticated: false,
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

  reset: () => set(initialState),
}));
