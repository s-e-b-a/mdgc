import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllVideoGames,
  addVideoGame,
  updateVideoGame,
  deleteVideoGame,
} from '@/lib/api';
import type { IVideoGame } from '@/types';

const VIDEO_GAMES_KEY = ['videoGames'] as const;

export function useVideoGames() {
  return useQuery({
    queryKey: VIDEO_GAMES_KEY,
    queryFn: getAllVideoGames,
  });
}

export function useAddVideoGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IVideoGame, 'id'>) => addVideoGame(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VIDEO_GAMES_KEY });
    },
  });
}

export function useUpdateVideoGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IVideoGame> }) =>
      updateVideoGame(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VIDEO_GAMES_KEY });
    },
  });
}

export function useDeleteVideoGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVideoGame(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: VIDEO_GAMES_KEY });
    },
  });
}
