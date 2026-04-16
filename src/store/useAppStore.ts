import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompletedSession, ProgressStore } from '../types';

const MAX_SESSIONS = 50;

interface AppStore {
  progress: ProgressStore;
  addSession: (session: CompletedSession) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      progress: { sessions: [] },

      addSession: (session) =>
        set((state) => {
          const sessions = [session, ...state.progress.sessions].slice(0, MAX_SESSIONS);
          return { progress: { sessions } };
        }),

      clearHistory: () =>
        set({ progress: { sessions: [] } }),
    }),
    {
      name: 'lpic1-progress',
      partialize: (state) => ({ progress: state.progress }),
    }
  )
);
