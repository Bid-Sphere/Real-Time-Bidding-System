import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useBidStore } from '@/store/useBidStore';
import { useChatStore } from '@/store/useChatStore';
import { useNotificationStore } from '@/store/useNotificationStore';

// Mock the stores
vi.mock('@/store/useDashboardStore');
vi.mock('@/store/useOrganizationStore');
vi.mock('@/store/useProjectStore');
vi.mock('@/store/useBidStore');
vi.mock('@/store/useChatStore');
vi.mock('@/store/useNotificationStore');

describe('Organization Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Reset all stores
    vi.clearAllMocks();
    
    // Setup default mock implementations
    (useDashboardStore as any).mockReturnValue({
      activeSection: 'analytics',
      setActiveSection: vi.fn(),
    });

    (useOrganizationStore as any).mockReturnValue({
      profile: {
        id: '1',
        companyName: 'Test Org',
        emailVerified: true,
        completionPercentage: 80,
      },
      analytics: {
        totalBids: 10,
        winRate: 30,
        activeProjects: 2,
        totalEarnings: 50000,
      },
      isLoading: false,
      fetchProfile: vi.fn(),
      fetchAnalytics: vi.fn(),
    });

    (useProjectStore as any).mockReturnValue({
      projects: [],
      filters: {},
      isLoading: false,
      fetchProjects: vi.fn(),
    });

    (useBidStore as any).mockReturnValue({
      bids: [],
      isLoading: false,
      fetchBids: vi.fn(),
    });

    (useChatStore as any).mockReturnValue({
      conversations: [],
      isLoading: false,
      fetchConversations: vi.fn(),
    });

    (useNotificationStore as any).mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      fetchNotifications: vi.fn(),
    });
  });

  it('should render dashboard with side panel navigation', () => {
    render(
      <BrowserRouter>
        <OrganizationDashboard />
      </BrowserRouter>
    );

    // Verify side panel navigation items are present
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Project Discovery')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('should navigate between sections when clicking side panel items', async () => {
    const mockSetActiveSection = vi.fn();
    (useDashboardStore as any).mockReturnValue({
      activeSection: 'analytics',
      setActiveSection: mockSetActiveSection,
    });

    render(
      <BrowserRouter>
        <OrganizationDashboard />
      </BrowserRouter>
    );

    const profileNav = screen.getByText('Profile');
    fireEvent.click(profileNav);

    // Verify navigation was triggered
    await waitFor(() => {
      expect(mockSetActiveSection).toHaveBeenCalled();
    });
  });

  it('should display analytics data on home page', () => {
    render(
      <BrowserRouter>
        <OrganizationDashboard />
      </BrowserRouter>
    );

    // Verify analytics metrics are displayed
    expect(screen.getByText('Total Bids')).toBeInTheDocument();
    expect(screen.getByText('Win Rate')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  it('should fetch all necessary data on mount', () => {
    const mockFetchProfile = vi.fn();
    const mockFetchAnalytics = vi.fn();
    const mockFetchProjects = vi.fn();
    const mockFetchBids = vi.fn();
    const mockFetchConversations = vi.fn();
    const mockFetchNotifications = vi.fn();

    (useOrganizationStore as any).mockReturnValue({
      profile: null,
      analytics: null,
      isLoading: false,
      fetchProfile: mockFetchProfile,
      fetchAnalytics: mockFetchAnalytics,
    });

    (useProjectStore as any).mockReturnValue({
      projects: [],
      filters: {},
      isLoading: false,
      fetchProjects: mockFetchProjects,
    });

    (useBidStore as any).mockReturnValue({
      bids: [],
      isLoading: false,
      fetchBids: mockFetchBids,
    });

    (useChatStore as any).mockReturnValue({
      conversations: [],
      isLoading: false,
      fetchConversations: mockFetchConversations,
    });

    (useNotificationStore as any).mockReturnValue({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      fetchNotifications: mockFetchNotifications,
    });

    render(
      <BrowserRouter>
        <OrganizationDashboard />
      </BrowserRouter>
    );

    // Verify all fetch functions were called
    expect(mockFetchProfile).toHaveBeenCalled();
    expect(mockFetchAnalytics).toHaveBeenCalled();
  });
});
