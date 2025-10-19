import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '../api-client';

export function useMyGroups() {
  return useQuery({
    queryKey: ['groups', 'my'],
    queryFn: groupsApi.getMyGroups,
  });
}

export function useGroup(id?: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: () => groupsApi.getGroup(id!),
    enabled: !!id,
  });
}

export function useGroupLeaderboard(id?: string) {
  return useQuery({
    queryKey: ['groups', id, 'leaderboard'],
    queryFn: () => groupsApi.getLeaderboard(id!),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => groupsApi.createGroup(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, code }: { id: string; code: string }) => groupsApi.joinGroup(id, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupsApi.leaveGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupsApi.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
