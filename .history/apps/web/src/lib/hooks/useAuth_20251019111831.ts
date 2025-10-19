import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api-client';
import { useAuthStore } from '../store/auth-store';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
  });

  const logout = () => {
    clearAuth();
    queryClient.clear();
    router.push('/login');
  };

  const { data: currentUser, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated(),
    retry: false,
  });

  const refreshUser = async () => {
    await refetch();
  };

  return {
    user: currentUser || user,
    isAuthenticated: isAuthenticated(),
    isLoading,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    refreshUser,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
  };
}
