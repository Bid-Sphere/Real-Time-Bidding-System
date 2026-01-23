import { useEffect, useState } from 'react';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useAuthStore } from '@/store/authStore';
import { ProfileCompletionBar } from '@/components/profile/ProfileCompletionBar';
import { EmailVerification } from '@/components/profile/EmailVerification';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { calculateProfileCompletion, getMissingFields } from '@/utils/profileUtils';
import type { OrganizationProfile } from '@/types/organization';

export default function ProfileSection() {
  const { profile, isLoading, fetchProfile, updateProfile, sendVerificationCode, verifyCode } =
    useOrganizationStore();
  const { user, refreshUser } = useAuthStore();

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  // Fetch profile on mount
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Calculate completion percentage and missing fields when profile changes
  useEffect(() => {
    if (profile && user) {
      // Use emailVerified from auth store (more reliable than profile state)
      const profileWithEmailStatus = {
        ...profile,
        emailVerified: user.emailVerified || false
      };
      
      const percentage = calculateProfileCompletion(profileWithEmailStatus);
      const missing = getMissingFields(profileWithEmailStatus);
      setCompletionPercentage(percentage);
      setMissingFields(missing);

      // Determine verification status from auth store
      if (user.emailVerified) {
        setVerificationStatus('verified');
      } else {
        // Check localStorage for pending verification state
        const pendingVerification = localStorage.getItem(`verification-pending-${user.email}`);
        setVerificationStatus(pendingVerification ? 'pending' : 'unverified');
      }
    }
  }, [profile, user]);

  const handleSaveProfile = async (data: Partial<OrganizationProfile>) => {
    if (!user?.id) return;

    await updateProfile(user.id, data);
  };

  const handleSendVerificationCode = async () => {
    if (!user) throw new Error('User not authenticated');

    const result = await sendVerificationCode(user.id);
    
    // Mark as pending in localStorage using email as key
    localStorage.setItem(`verification-pending-${user.email}`, 'true');
    setVerificationStatus('pending');
    
    return result;
  };

  const handleVerifyCode = async (code: string) => {
    if (!user) throw new Error('User not authenticated');

    const result = await verifyCode(user.id, code);
    
    if (result.verified) {
      // Clear pending state
      localStorage.removeItem(`verification-pending-${user.email}`);
      setVerificationStatus('verified');
      
      // Refresh user data to get updated emailVerified status
      await refreshUser();
    }
    
    return result;
  };

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-400">Failed to load profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Management</h1>
        <p className="text-gray-400">
          Complete your organization profile to unlock all platform features and increase your
          credibility.
        </p>
      </div>

      {/* Profile Completion Bar */}
      <ProfileCompletionBar percentage={completionPercentage} missingFields={missingFields} />

      {/* Email Verification */}
      <EmailVerification
        email={user?.email || 'No email'}
        status={verificationStatus}
        onSendCode={handleSendVerificationCode}
        onVerifyCode={handleVerifyCode}
      />

      {/* Profile Form */}
      <ProfileForm profile={profile} onSave={handleSaveProfile} isLoading={isLoading} />
    </div>
  );
}
