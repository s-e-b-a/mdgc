import { useQuery } from '@tanstack/react-query';
import { getStatisticsReport } from '@/lib/apiClient';

const STATISTICS_KEY = ['statistics'] as const;

export function useStatistics() {
  return useQuery({
    queryKey: STATISTICS_KEY,
    queryFn: getStatisticsReport,
  });
}
