import { useEffect, useState } from 'react';
import { useClientStore } from '../store/useClientStore';
import { isClientProfileComplete } from '../utils/clientProfileUtils';

export const useClientProfileCompletion = () => {
  const { profile, fetchProfile } = useClientStore();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!profile) {
        // Fetch profile if not loaded
        try {
          await fetchProfile('client-1'); // Using mock client ID
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
      setIsLoading(false);
    };

    checkProfile();
  }, [profile, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setIsComplete(isClientProfileComplete(profile));
    }
  }, [profile]);

  return {
    isComplete,
    isLoading,
    profile,
  };
};