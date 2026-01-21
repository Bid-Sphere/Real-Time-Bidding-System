import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectDiscoverySection from '@/pages/dashboard/ProjectDiscoverySection';
import { useProjectStore } from '@/store/useProjectStore';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useBidStore } from '@/store/useBidStore';

vi.mock('@/store/useProjectStore');
vi.mock('@/store/useOrganizationStore');
vi.mock('@/store/useBidStore');

describe('Bid Submission Flow Integration Tests', () => {
  const [] = [
    {
      id: '1',
      title: 'Test Project 1',
      description: 'Test description',
      category: 'Web Development',
      budgetMin: 5000,
      budgetMax: 10000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      clientId: 'client1',
      clientName: 'Test Client',
      requirements: ['Requirement 1'],
      bidCount: 5,
      status: 'open' as const,
      postedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useOrganizationStore as any).mockReturnValue({
      profile: {
        id: '1',
        companyName: 'Test Org',
        emailVerified: true,
        completionPercentage: 100,
      },
      isLoading: false,
    });

    (useProjectStore as any).mockReturnValue({
      projects: [],
      filters: {},
      isLoading: false,
      fetchProjects: vi.fn(),
      markAsInterested: vi.fn(),
      submitBid: vi.fn(),
    });

    (useBidStore as any).mockReturnValue({
      bids: [],
      isLoading: false,
      fetchBids: vi.fn(),
    });
  });

  it('should display projects in discovery section', () => {
    render(
      <BrowserRouter>
        <ProjectDiscoverySection />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Project 1')).toBeInTheDocument();
    expect(screen.getByText('Test Client')).toBeInTheDocument();
  });

  it('should allow verified users to submit bids', async () => {
    const mockSubmitBid = vi.fn();
    (useProjectStore as any).mockReturnValue({
      projects: [],
      filters: {},
      isLoading: false,
      fetchProjects: vi.fn(),
      markAsInterested: vi.fn(),
      submitBid: mockSubmitBid,
    });

    render(
      <BrowserRouter>
        <ProjectDiscoverySection />
      </BrowserRouter>
    );

    // Find and click "Bid Now" button
    const bidButtons = screen.getAllByText('Bid Now');
    fireEvent.click(bidButtons[0]);

    // Verify bid modal opens
    await waitFor(() => {
      expect(screen.getByText('Submit Your Bid')).toBeInTheDocument();
    });
  });

  it('should prevent unverified users from bidding', () => {
    (useOrganizationStore as any).mockReturnValue({
      profile: {
        id: '1',
        companyName: 'Test Org',
        emailVerified: false,
        completionPercentage: 50,
      },
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <ProjectDiscoverySection />
      </BrowserRouter>
    );

    // Verify "Bid Now" buttons are disabled
    const bidButtons = screen.getAllByText('Bid Now');
    bidButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('should allow marking projects as interested', async () => {
    const mockMarkAsInterested = vi.fn();
    (useProjectStore as any).mockReturnValue({
      projects: [],
      filters: {},
      isLoading: false,
      fetchProjects: vi.fn(),
      markAsInterested: mockMarkAsInterested,
      submitBid: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProjectDiscoverySection />
      </BrowserRouter>
    );

    // Find and click "Mark as Interested" button
    const interestedButtons = screen.getAllByText('Mark as Interested');
    fireEvent.click(interestedButtons[0]);

    // Verify the action was called
    await waitFor(() => {
      expect(mockMarkAsInterested).toHaveBeenCalledWith('1');
    });
  });

  it('should filter projects based on criteria', async () => {
    const mockFetchProjects = vi.fn();
    (useProjectStore as any).mockReturnValue({
      projects: [],
      filters: {},
      isLoading: false,
      fetchProjects: mockFetchProjects,
      markAsInterested: vi.fn(),
      submitBid: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProjectDiscoverySection />
      </BrowserRouter>
    );

    // Find search input
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Web Development' } });

    // Verify filtering was triggered
    await waitFor(() => {
      expect(mockFetchProjects).toHaveBeenCalled();
    });
  });
});
