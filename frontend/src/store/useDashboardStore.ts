import { create } from 'zustand';

export type DashboardSection = 'analytics' | 'profile' | 'teams' | 'projects' | 'chat' | 'bids' | 'dashboard';

interface DashboardState {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeSection: 'analytics',
  setActiveSection: (section) => set({ activeSection: section }),
}));
