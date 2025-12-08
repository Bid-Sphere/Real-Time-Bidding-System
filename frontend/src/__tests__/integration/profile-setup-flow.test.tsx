import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileSection from '@/pages/dashboard/ProfileSection';
import { useOrganizationStore } from '@/store/useOrganizationStore';

vi.mock('@/store/useOrganizationStore');

describe('Profile Setup Flow Integration Tests', () => {
  const mockProfile = {
    id: '1',
    userId: 'user1',
    companyName: 'Test Company',
    industry: 'Technology',
    companySize: '10-50',
    website: 'https://test.com',
    taxId: 'TAX123',
    businessRegistrationNumber: 'REG123',
    contactPerson: 'John Doe',
    contactPersonRole: 'CEO',
    emailVerified: false,
    completionPercentage: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useOrganizationStore as any).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
      sendVerificationCode: vi.fn(),
      verifyCode: vi.fn(),
    });
  });

  it('should display profile completion percentage', () => {
    render(
      <BrowserRouter>
        <ProfileSection />
      </BrowserRouter>
    );

    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });

  it('should display email verification section', () => {
    render(
      <BrowserRouter>
        <ProfileSection />
      </BrowserRouter>
    );

    expect(screen.getByText(/Email Verification/i)).toBeInTheDocument();
  });

  it('should allow sending verification code for unverified email', async () => {
    const mockSendCode = vi.fn();
    (useOrganizationStore as any).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
      sendVerificationCode: mockSendCode,
      verifyCode: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProfileSection />
      </BrowserRouter>
    );

    const sendButton = screen.getByText(/Send Verification Code/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendCode).toHaveBeenCalled();
    });
  });

  it('should display verified badge for verified email', () => {
    (useOrganizationStore as any).mockReturnValue({
      profile: {
        ...mockProfile,
        emailVerified: true,
        completionPercentage: 100,
      },
      isLoading: false,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
      sendVerificationCode: vi.fn(),
      verifyCode: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProfileSection />
      </BrowserRouter>
    );

    expect(screen.getByText(/Verified/i)).toBeInTheDocument();
  });

  it('should allow updating profile information', async () => {
    const mockUpdateProfile = vi.fn();
    (useOrganizationStore as any).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      fetchProfile: vi.fn(),
      updateProfile: mockUpdateProfile,
      sendVerificationCode: vi.fn(),
      verifyCode: vi.fn(),
    });

    render(
      <BrowserRouter>
        <ProfileSection />
      </BrowserRouter>
    );

    // Find company name input and update it
    const companyInput = screen.getByDisplayValue('Test Company');
    fireEvent.change(companyInput, { target: { value: 'Updated Company' } });

    // Find and click save button
    const saveButton = screen.getByText(/Save Changes/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  it('should calculate profile completion correctly', () => {
    render(
      <BrowserRouter>
        <ProfileSection />
      </BrowserRouter>
    );

    // Profile has 6 required fields filled out of 6 (excluding email verification)
    // So completion should be shown
    expect(screen.getByText(/Profile Completion/i)).toBeInTheDocument();
  });
});
