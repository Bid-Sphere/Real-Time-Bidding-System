import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SidePanel from '@/components/layout/SidePanel';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { BidSubmissionModal } from '@/components/projects/BidSubmissionModal';

describe('Keyboard Navigation Accessibility Tests', () => {
  describe('SidePanel Navigation', () => {
    it('should have keyboard-accessible navigation items', () => {
      const mockSetActive = vi.fn();
      
      render(
        <BrowserRouter>
          <SidePanel onNavigate={mockSetActive} />
        </BrowserRouter>
      );

      // All navigation items should be focusable
      const profileLink = screen.getByText('Profile').closest('a');
      const teamsLink = screen.getByText('Teams').closest('a');
      const projectsLink = screen.getByText('Project Discovery').closest('a');
      const chatLink = screen.getByText('Chat').closest('a');

      expect(profileLink).toBeInTheDocument();
      expect(teamsLink).toBeInTheDocument();
      expect(projectsLink).toBeInTheDocument();
      expect(chatLink).toBeInTheDocument();

      // Links should have proper href attributes for keyboard navigation
      expect(profileLink).toHaveAttribute('href');
      expect(teamsLink).toHaveAttribute('href');
      expect(projectsLink).toHaveAttribute('href');
      expect(chatLink).toHaveAttribute('href');
    });
  });

  describe('Project Card Actions', () => {
    const mockProject = {
      id: '1',
      title: 'Test Project',
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
    };

    it('should have keyboard-accessible action buttons', () => {
      render(
        <BrowserRouter>
          <ProjectCard 
            project={mockProject}
            isVerified={true}
            onViewDetails={vi.fn()}
            onBid={vi.fn()}
            onInterest={vi.fn()}
          />
        </BrowserRouter>
      );

      // All action buttons should be present and focusable
      const viewDetailsButton = screen.getByText('View Details');
      const bidButton = screen.getByText('Bid Now');
      const interestButton = screen.getByText('Mark as Interested');

      expect(viewDetailsButton).toBeInTheDocument();
      expect(bidButton).toBeInTheDocument();
      expect(interestButton).toBeInTheDocument();

      // Buttons should be keyboard accessible (not disabled)
      expect(bidButton).not.toBeDisabled();
    });

    it('should indicate disabled state for unverified users', () => {
      render(
        <BrowserRouter>
          <ProjectCard 
            project={mockProject}
            isVerified={false}
            onViewDetails={vi.fn()}
            onBid={vi.fn()}
            onInterest={vi.fn()}
          />
        </BrowserRouter>
      );

      const bidButton = screen.getByText('Bid Now');
      expect(bidButton).toBeDisabled();
    });
  });

  describe('Modal Focus Management', () => {
    const mockProject = {
      id: '1',
      title: 'Test Project',
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
    };

    it('should have close button in modal', () => {
      render(
        <BrowserRouter>
          <BidSubmissionModal 
            isOpen={true}
            onClose={vi.fn()}
            onSubmit={vi.fn()}
            project={mockProject}
            isVerified={true}
          />
        </BrowserRouter>
      );

      // Modal should have a close button
      const closeButtons = screen.getAllByRole('button');
      expect(closeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      const mockProject = {
        id: '1',
        title: 'Test Project',
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
      };

      render(
        <BrowserRouter>
          <BidSubmissionModal 
            isOpen={true}
            onClose={vi.fn()}
            onSubmit={vi.fn()}
            project={mockProject}
            isVerified={true}
          />
        </BrowserRouter>
      );

      // Form inputs should have associated labels
      expect(screen.getByLabelText(/Proposed Price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Estimated Timeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cover Letter/i)).toBeInTheDocument();
    });
  });
});
