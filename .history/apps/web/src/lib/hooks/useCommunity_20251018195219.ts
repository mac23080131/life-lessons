import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityApi } from '../api-client';

export function usePublicFeed(params?: { limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ['community', 'feed', params],
    queryFn: () => communityApi.getPublicFeed(params),
  });
}

export function useReactToLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, type }: { lessonId: string; type: string }) =>
      communityApi.reactToLesson(lessonId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
}

export function useReportLesson() {
  return useMutation({
    mutationFn: ({ lessonId, reason }: { lessonId: string; reason?: string }) =>
      communityApi.reportLesson(lessonId, reason),
  });
}

export function useChallenges() {
  return useQuery({
    queryKey: ['community', 'challenges'],
    queryFn: communityApi.getChallenges,
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (challengeId: string) => communityApi.joinChallenge(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'my-challenges'] });
    },
  });
}

export function useMyChallenges() {
  return useQuery({
    queryKey: ['community', 'my-challenges'],
    queryFn: communityApi.getMyChallenges,
  });
}
