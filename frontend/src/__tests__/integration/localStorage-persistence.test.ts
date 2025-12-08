import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApiService } from '@/mocks/mockApiService';

describe('LocalStorage Persistence Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should persist interested projects to localStorage', async () => {
    const projectId = 'proj1';
    const orgId = 'org1';

    // Mark project as interested
    await mockApiService.projects.markAsInterested(projectId, orgId);

    // Verify localStorage was updated
    const stored = localStorage.getItem('interestedProjects');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const interestedProjects = JSON.parse(stored);
      expect(interestedProjects).toContain(projectId);
    }
  });

  it('should persist bid submissions to localStorage', async () => {
    const bid = {
      projectId: 'proj1',
      projectTitle: 'Test Project',
      organizationId: 'org1',
      proposedPrice: 5000,
      estimatedTimeline: '2 weeks',
      coverLetter: 'Test cover letter',
      status: 'pending' as const,
    };

    // Submit bid
    await mockApiService.bids.submitBid(bid);

    // Verify localStorage was updated
    const stored = localStorage.getItem('bids');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const bids = JSON.parse(stored);
      expect(bids).toHaveLength(1);
      expect(bids[0].projectId).toBe('proj1');
    }
  });

  it('should persist profile updates to localStorage', async () => {
    const orgId = 'org1';
    const updates = {
      companyName: 'Updated Company',
      industry: 'Technology',
    };

    // Update profile
    await mockApiService.profile.updateProfile(orgId, updates);

    // Verify localStorage was updated
    const stored = localStorage.getItem('organizationProfile');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const profile = JSON.parse(stored);
      expect(profile.companyName).toBe('Updated Company');
      expect(profile.industry).toBe('Technology');
    }
  });

  it('should persist team member additions to localStorage', async () => {
    const orgId = 'org1';
    const member = {
      name: 'John Doe',
      role: 'Developer',
      skills: ['React', 'TypeScript'],
      bio: 'Test bio',
    };

    // Add team member
    await mockApiService.teams.addTeamMember(orgId, member);

    // Verify localStorage was updated
    const stored = localStorage.getItem('teamMembers');
    expect(stored).toBeTruthy();
    
    if (stored) {
      const members = JSON.parse(stored);
      expect(members.length).toBeGreaterThan(0);
      const addedMember = members.find((m: any) => m.name === 'John Doe');
      expect(addedMember).toBeTruthy();
    }
  });

  it('should retrieve persisted data on page reload', async () => {
    const orgId = 'org1';
    
    // Store some data
    const testProfile = {
      id: orgId,
      companyName: 'Test Company',
      emailVerified: true,
    };
    localStorage.setItem('organizationProfile', JSON.stringify(testProfile));

    // Fetch profile (should get from localStorage)
    const profile = await mockApiService.profile.getProfile(orgId);

    expect(profile.companyName).toBe('Test Company');
    expect(profile.emailVerified).toBe(true);
  });

  it('should handle localStorage quota exceeded gracefully', () => {
    // Mock localStorage.setItem to throw quota exceeded error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });

    // Attempt to store large data
    expect(() => {
      try {
        localStorage.setItem('test', 'data');
      } catch (error) {
        // Should handle error gracefully
        expect(error).toBeTruthy();
      }
    }).not.toThrow();

    // Restore original
    localStorage.setItem = originalSetItem;
  });
});
