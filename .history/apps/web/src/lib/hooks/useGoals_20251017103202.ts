import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api-client';

export function useGoal() {
  return useQuery({
    queryKey: ['goals', 'my'],
    queryFn: goalsApi.getMy,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useGoalRoadmap(id?: string) {
  return useQuery({
    queryKey: ['goals', id, 'roadmap'],
    queryFn: () => goalsApi.getRoadmap(id!),
    enabled: !!id,
  });
}
