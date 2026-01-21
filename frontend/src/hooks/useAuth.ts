import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const token = useAuthStore((state) => state.token);
  const registrationStep = useAuthStore((state) => state.registrationStep);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setToken = useAuthStore((state) => state.setToken);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    registrationStep,
    login,
    signup,
    logout,
    checkAuth,
    setToken,
    refreshUser,
  };
};
