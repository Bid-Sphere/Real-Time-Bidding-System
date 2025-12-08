import { create } from 'zustand';

type DashboardSection = 'analytics' | 'profile' | 'teams' | 'projects' | 'chat';

interface DashboardState {
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeSection: 'analytics',
  setActiveSection: (section) => set({ activeSection: section }),
}));
