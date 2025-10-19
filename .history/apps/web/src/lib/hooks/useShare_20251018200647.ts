import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export function useShareLesson(type: 'community' | 'group' | 'url') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: any) => {
      if (type === 'community') {
        const { data } = await apiClient.post(`/lessons/${params}/share-to-community`);
        return data;
      } else if (type === 'group') {
        const { data } = await apiClient.post(
          `/lessons/${params.lessonId}/share-to-group`,
          { groupId: params.groupId }
        );
        return data;
      } else {
        const { data } = await apiClient.get(`/lessons/${params}/share-url`);
        return data;
      }
    },
    onSuccess: () => {
      if (type === 'community') {
        queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
        queryClient.invalidateQueries({ queryKey: ['lessons'] });
      } else if (type === 'group') {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
        queryClient.invalidateQueries({ queryKey: ['lessons'] });
      }
    },
  });
}
