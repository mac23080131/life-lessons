import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '../api-client';

export function useLessons(params?: any) {
  return useQuery({
    queryKey: ['lessons', params],
    queryFn: () => lessonsApi.getAll(params),
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['lessons', id],
    queryFn: () => lessonsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      lessonsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', variables.id] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useAnalyzeLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsApi.analyze,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}
