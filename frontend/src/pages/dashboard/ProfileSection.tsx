import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { ProfileCompletionBar } from '@/components/profile/ProfileCompletionBar';
import { EmailVerification } from '@/components/profile/EmailVerification';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { calculateProfileCompletion, getMissingFields } from '@/utils/profileUtils';
import type { OrganizationProfile } from '@/types/organization';

export default function ProfileSection() {
  const { profile, isLoading, fetchProfile, updateProfile, sendVerificationCode, verifyCode } =
    useOrganizationStore();

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  // Fetch profile on mount
  useEffect(() => {
    // Using mock orgId for development
    const orgId = 'org-1';
    fetchProfile(orgId);
  }, [fetchProfile]);

  // Calculate completion percentage and missing fields when profile changes
  useEffect(() => {
    if (profile) {
      const percentage = calculateProfileCompletion(profile);
      const missing = getMissingFields(profile);
      setCompletionPercentage(percentage);
      setMissingFields(missing);

      // Determine verification status
      if (profile.emailVerified) {
        setVerificationStatus('verified');
      } else {
        // Check localStorage for pending verification state
        const pendingVerification = localStorage.getItem(`verification-pending-${profile.id}`);
        setVerificationStatus(pendingVerification ? 'pending' : 'unverified');
      }
    }
  }, [profile]);

  const handleSaveProfile = async (data: Partial<OrganizationProfile>) => {
    if (!profile) return;

    await updateProfile(profile.id, data);
  };

  const handleSendVerificationCode = async () => {
    if (!profile) throw new Error('Profile not loaded');

    const result = await sendVerificationCode(profile.id);
    
    // Mark as pending in localStorage
    localStorage.setItem(`verification-pending-${profile.id}`, 'true');
    setVerificationStatus('pending');
    
    return result;
  };

  const handleVerifyCode = async (code: string) => {
    if (!profile) throw new Error('Profile not loaded');

    const result = await verifyCode(profile.id, code);
    
    if (result.verified) {
      // Clear pending state
      localStorage.removeItem(`verification-pending-${profile.id}`);
      setVerificationStatus('verified');
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-8"
    >
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
        email={profile.userId} // Using userId as email for mock data
        status={verificationStatus}
        onSendCode={handleSendVerificationCode}
        onVerifyCode={handleVerifyCode}
      />

      {/* Profile Form */}
      <ProfileForm profile={profile} onSave={handleSaveProfile} isLoading={isLoading} />
    </motion.div>
  );
}
