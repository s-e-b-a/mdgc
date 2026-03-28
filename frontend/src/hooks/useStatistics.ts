import { useQuery } from '@tanstack/react-query';
import { getStatisticsReport, ping, getTotalCollectionValue } from '@/lib/apiClient';
import type { StatisticsReport, PingResponse, CollectionValue } from '@/types';

const STATISTICS_KEY = ['statistics'] as const;
const PING_KEY = ['ping'] as const;
const COLLECTION_VALUE_KEY = ['collection-value'] as const;

export function useStatistics() {
  return useQuery<StatisticsReport>({
    queryKey: STATISTICS_KEY,
    queryFn: getStatisticsReport,
  });
}

export function usePing() {
  return useQuery<PingResponse>({
    queryKey: PING_KEY,
    queryFn: ping,
  });
}

export function useCollectionValue() {
  return useQuery<CollectionValue>({
    queryKey: COLLECTION_VALUE_KEY,
    queryFn: getTotalCollectionValue,
  });
}
