import { useState, useEffect } from 'react';
import { X, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useClientStore } from '@/store/useClientStore';
import { calculateProfileCompletion } from '@/utils/profileUtils';
import { calculateClientProfileCompletion } from '@/utils/clientProfileUtils';
import Button from '@/components/ui/Button';

export default function ProfileCompletionBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState<number | null>(null);
  const { user } = useAuth();
  const { profile: orgProfile, fetchProfile: fetchOrgProfile } = useOrganizationStore();
  const { profile: clientProfile, fetchProfile: fetchClientProfile } = useClientStore();
  const navigate = useNavigate();

  // Fetch profile data when component mounts
  useEffect(() => {
    if (user) {
      if (user.role === 'organization') {
        fetchOrgProfile(user.id);
      } else if (user.role === 'client') {
        fetchClientProfile(user.id);
      }
    }
  }, [user, fetchOrgProfile, fetchClientProfile]);

  // Calculate completion percentage when profile or user changes
  useEffect(() => {
    if (user?.role === 'organization' && orgProfile) {
      // Use emailVerified from auth store for accurate calculation
      const profileWithEmailStatus = {
        ...orgProfile,
        emailVerified: user.emailVerified || false
      };
      
      const percentage = calculateProfileCompletion(profileWithEmailStatus);
      setCompletionPercentage(percentage);
    } else if (user?.role === 'client' && clientProfile) {
      // For clients, use the proper profile completion calculation
      const profileWithEmailStatus = {
        ...clientProfile,
        emailVerified: user.emailVerified || false
      };
      
      const percentage = calculateClientProfileCompletion(profileWithEmailStatus);
      setCompletionPercentage(percentage);
    }
  }, [orgProfile, clientProfile, user]);

  // Show banner only if profile is loaded AND not 100% complete
  const shouldShow = user && completionPercentage !== null && completionPercentage < 100;

  if (!shouldShow || !isVisible) {
    return null;
  }

  const handleCompleteProfile = () => {
    // Navigate to profile section based on user role
    if (user.role === 'client') {
      navigate('/client-dashboard/profile');
    } else {
      navigate('/organization-dashboard/profile');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Finish setting up your profile to access all features and start bidding on projects. ({completionPercentage}% complete)
            </p>
            <Button
              onClick={handleCompleteProfile}
              variant="primary"
              size="sm"
              icon={<ArrowRight className="h-4 w-4" />}
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
            >
              Complete Profile
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}