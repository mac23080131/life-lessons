import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api-client';

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.getOverview,
  });
}
