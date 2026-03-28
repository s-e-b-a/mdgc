import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllPlatforms,
  addPlatform,
  updatePlatform,
  deletePlatform,
} from '@/lib/apiClient';
import type { IPlatform } from '@/types';

const PLATFORMS_KEY = ['platforms'] as const;

export function usePlatforms() {
  return useQuery({
    queryKey: PLATFORMS_KEY,
    queryFn: getAllPlatforms,
  });
}

export function useAddPlatform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IPlatform, 'id'>) => addPlatform(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLATFORMS_KEY });
    },
  });
}

export function useUpdatePlatform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IPlatform> }) =>
      updatePlatform(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLATFORMS_KEY });
    },
  });
}

export function useDeletePlatform() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePlatform(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PLATFORMS_KEY });
    },
  });
}
