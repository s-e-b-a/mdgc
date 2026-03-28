import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllConsoles,
  addConsole,
  updateConsole,
  deleteConsole,
} from '@/lib/apiClient';
import type { IConsole } from '@/types';

const CONSOLES_KEY = ['consoles'] as const;

export function useConsoles() {
  return useQuery({
    queryKey: CONSOLES_KEY,
    queryFn: getAllConsoles,
  });
}

export function useAddConsole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IConsole, 'id'>) => addConsole(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONSOLES_KEY });
    },
  });
}

export function useUpdateConsole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IConsole> }) =>
      updateConsole(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONSOLES_KEY });
    },
  });
}

export function useDeleteConsole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteConsole(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CONSOLES_KEY });
    },
  });
}
