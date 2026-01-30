import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useClientStore } from '@/store/useClientStore';
import { ProfileCompletionBar } from '@/components/profile/ProfileCompletionBar';
import { EmailVerification } from '@/components/profile/EmailVerification';
import { ClientProfileForm } from './ClientProfileForm';
import { calculateClientProfileCompletion, getMissingClientFields } from '../../utils/clientProfileUtils';
import { showSuccessToast, showErrorToast, formatErrorMessage } from '../../utils/toast';
import type { ClientProfile } from '../../types/client';

export default function ClientProfile() {
  const { user, refreshUser } = useAuthStore();
  const { 
    profile: storeProfile, 
    isLoading: storeLoading, 
    fetchProfile, 
    updateProfile, 
    sendVerificationCode, 
    verifyCode 
  } = useClientStore();
  
  // Use store profile or create default profile
  const [profile, setProfile] = useState<ClientProfile>({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    companyName: storeProfile?.companyName || '',
    industry: storeProfile?.industry || '',
    website: storeProfile?.website || '',
    billingAddress: storeProfile?.billingAddress || '',
    taxId: storeProfile?.taxId || '',
    emailVerified: user?.emailVerified || false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  // Fetch profile on component mount
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Update local profile when store profile changes
  useEffect(() => {
    if (storeProfile) {
      setProfile(prev => ({
        ...prev,
        companyName: storeProfile.companyName || '',
        industry: storeProfile.industry || '',
        website: storeProfile.website || '',
        billingAddress: storeProfile.billingAddress || '',
        taxId: storeProfile.taxId || '',
      }));
    }
  }, [storeProfile]);

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
  }, [profile, user]);

  const handleSaveProfile = async (data: Partial<ClientProfile>) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      await updateProfile(user.id, data);
      
      // Update local state
      setProfile(prev => ({ ...prev, ...data }));
      
      showSuccessToast('Profile saved successfully');
    } catch (error) {
      const errorMessage = formatErrorMessage(error);
      showErrorToast(errorMessage);
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
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
      
      console.log('Verification code sent');
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
        
        setVerificationStatus('verified');
        
        // Refresh user data to get updated emailVerified status
        await refreshUser();
        
        console.log('Email verified successfully');
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
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
          Complete your client profile to unlock all platform features and increase your
          credibility with service providers.
        </p>
      </div>

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
      <ClientProfileForm
        profile={profile}
        onSave={handleSaveProfile}
        isLoading={isLoading || storeLoading}
      />
    </div>
  );
}