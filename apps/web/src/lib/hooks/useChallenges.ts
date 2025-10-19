import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesApi } from '../api-client';

export function useChallenges() {
  return useQuery({
    queryKey: ['challenges', 'community'],
    queryFn: challengesApi.getCommunity,
  });
}

export function useMyChallenges() {
  return useQuery({
    queryKey: ['challenges', 'my'],
    queryFn: challengesApi.getMy,
  });
}

export function useGroupChallenges(groupId?: string) {
  return useQuery({
    queryKey: ['challenges', 'group', groupId],
    queryFn: () => challengesApi.getGroup(groupId!),
    enabled: !!groupId,
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challengesApi.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      type: 'COMMUNITY' | 'GROUP' | 'PERSONAL';
      scope: 'LESSON_COUNT' | 'STREAK' | 'DOMAIN_BALANCE' | 'DAILY_PRACTICE';
      target: number;
      duration: number;
      difficulty: 'EASY' | 'MEDIUM' | 'HARD';
      groupId?: string;
    }) => challengesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challengesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}
