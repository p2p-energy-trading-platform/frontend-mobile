import { create } from 'zustand';

export type AppStatus = 'idle' | 'loading' | 'ready' | 'error';

type AppStore = {
  initialized: boolean;
  status: AppStatus;

  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AppStatus) => void;

  reset: () => void;
};

const initialState = {
  initialized: false,
  status: 'idle' as AppStatus,
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

  reset: () =>
    set(initialState),
}));