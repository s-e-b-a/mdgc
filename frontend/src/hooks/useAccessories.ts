import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllAccessories,
  addAccessory,
  updateAccessory,
  deleteAccessory,
} from '@/lib/api';
import type { Accessory } from '@/types';

const ACCESSORIES_KEY = ['accessories'] as const;

export function useAccessories() {
  return useQuery({
    queryKey: ACCESSORIES_KEY,
    queryFn: getAllAccessories,
  });
}

export function useAddAccessory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Accessory, 'id'>) => addAccessory(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCESSORIES_KEY });
    },
  });
}

export function useUpdateAccessory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Accessory> }) =>
      updateAccessory(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCESSORIES_KEY });
    },
  });
}

export function useDeleteAccessory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAccessory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCESSORIES_KEY });
    },
  });
}
