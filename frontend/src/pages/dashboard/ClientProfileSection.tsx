import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useClientStore } from '@/store/useClientStore';
import { ProfileCompletionBar } from '@/components/profile/ProfileCompletionBar';
import { EmailVerification } from '@/components/profile/EmailVerification';
import { ClientProfileForm } from '@/components/client/ClientProfileForm';

import { calculateClientProfileCompletion, getMissingClientFields } from '@/utils/clientProfileUtils';
import type { ClientProfile } from '@/types/client';

export default function ClientProfileSection() {
  const { user, refreshUser } = useAuthStore();
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile, 
    sendVerificationCode, 
    verifyCode 
  } = useClientStore();
  
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  // Fetch profile on component mount
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
      
      const percentage = calculateClientProfileCompletion(profileWithEmailStatus);
      const missing = getMissingClientFields(profileWithEmailStatus);
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
  }, [profile, user, user?.emailVerified]); // Add user.emailVerified as dependency

  const handleSaveProfile = async (data: Partial<ClientProfile>) => {
    if (!user?.id) return;
    
    try {
      await updateProfile(user.id, data);
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Error is already handled by the store
    }
  };

  const handleSendVerificationCode = async () => {
    if (!user?.id) return { message: 'User not found', expiresAt: '' };
    
    try {
      const result = await sendVerificationCode(user.id);
      
      // Mark as pending in localStorage
      if (user?.email) {
        localStorage.setItem(`verification-pending-${user.email}`, 'true');
        setVerificationStatus('pending');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to send verification code:', error);
      throw error;
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (!user?.id) return { verified: false, message: 'User not found' };
    
    try {
      const result = await verifyCode(user.id, code);
      
      if (result.verified) {
        // Clean up localStorage
        if (user?.email) {
          localStorage.removeItem(`verification-pending-${user.email}`);
        }
        
        // Refresh user data to get updated emailVerified status
        await refreshUser();
        
        // Set verification status to verified after refreshing user data
        setVerificationStatus('verified');
      }
      
      return result;
    } catch (error) {
      console.error('Failed to verify code:', error);
      return {
        verified: false,
        message: 'Invalid verification code'
      };
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Profile Completion Bar */}
      <ProfileCompletionBar
        percentage={completionPercentage}
        missingFields={missingFields}
      />

      {/* Email Verification */}
      <EmailVerification
        email={user.email}
        status={verificationStatus}
        onSendCode={handleSendVerificationCode}
        onVerifyCode={handleVerifyCode}
      />

      {/* Profile Form */}
      {profile && (
        <ClientProfileForm
          profile={profile}
          onSave={handleSaveProfile}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}