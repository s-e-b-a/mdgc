import {
  useVideoGames,
  useAddVideoGame,
  useUpdateVideoGame,
  useDeleteVideoGame,
} from '@/hooks/useVideoGames';
import { usePlatforms } from '@/hooks/usePlatforms';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import GameFormDialog from '@/components/GameFormDialog';
import type { IVideoGame, ApiError } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function VideoGamesPage() {
  const { data: games, isLoading, isError, error, refetch } = useVideoGames();
  const { data: platforms } = usePlatforms();
  const addMutation = useAddVideoGame();
  const updateMutation = useUpdateVideoGame();
  const deleteMutation = useDeleteVideoGame();

  // Zustand store state & actions
  const {
    selectedGame,
    formDialogOpen,
    editMode,
    deleteDialogOpen,
    noPlatformDialogOpen,
  } = useInventoryStore((s) => s.videoGames);

  const {
    setSelectedGame,
    setGameFormDialogOpen,
    setGameEditMode,
    setGameDeleteDialogOpen,
    setGameNoPlatformDialogOpen,
    resetGameSelection,
  } = useInventoryStore();

  const handleAdd = () => {
    if (!platforms || platforms.length === 0) {
      setGameNoPlatformDialogOpen(true);
      return;
    }
    setGameEditMode(false);
    setGameFormDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedGame) return;
    setGameEditMode(true);
    setGameFormDialogOpen(true);
  };

  const handleSave = (data: Omit<IVideoGame, 'id' | 'platform'>) => {
    const payload = { ...data, platform: null };
    if (editMode && selectedGame) {
      updateMutation.mutate(
        { id: selectedGame.id, data: payload },
        {
          onSuccess: () => {
            setGameFormDialogOpen(false);
            resetGameSelection();
          },
          onError: (err) => {
            const apiErr = (err as Error & { apiError?: ApiError }).apiError;
            console.error('Update failed:', apiErr?.message ?? err.message);
          },
        }
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => {
          setGameFormDialogOpen(false);
        },
        onError: (err) => {
          const apiErr = (err as Error & { apiError?: ApiError }).apiError;
          console.error('Add failed:', apiErr?.message ?? err.message);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedGame) return;
    deleteMutation.mutate(selectedGame.id, {
      onSuccess: () => {
        setGameDeleteDialogOpen(false);
        resetGameSelection();
      },
      onError: (err) => {
        const apiErr = (err as Error & { apiError?: ApiError }).apiError;
        console.error('Delete failed:', apiErr?.message ?? err.message);
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Video Games</h2>

      {/* Action bar */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Game
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedGame}
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit Game
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={!selectedGame}
          onClick={() => setGameDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Game
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading video games...</p>
      ) : isError ? (
        <p className="text-destructive">
          {(error as Error & { apiError?: ApiError })?.apiError?.message ?? 'Failed to load video games.'}
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games && games.length > 0 ? (
                games.map((game) => (
                  <TableRow
                    key={game.id}
                    className={cn(
                      'cursor-pointer',
                      selectedGame?.id === game.id && 'bg-muted'
                    )}
                    onClick={() =>
                      setSelectedGame(
                        selectedGame?.id === game.id ? null : game
                      )
                    }
                    data-state={
                      selectedGame?.id === game.id ? 'selected' : undefined
                    }
                  >
                    <TableCell>{game.id}</TableCell>
                    <TableCell>{game.title}</TableCell>
                    <TableCell>{game.platform}</TableCell>
                    <TableCell>{game.format}</TableCell>
                    <TableCell>{game.playState}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No video games found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Game Form Dialog */}
      <GameFormDialog
        open={formDialogOpen}
        onOpenChange={setGameFormDialogOpen}
        onSave={handleSave}
        game={editMode ? selectedGame : null}
        platforms={platforms ?? []}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setGameDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {selectedGame?.title}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* No Platform Warning */}
      <AlertDialog
        open={noPlatformDialogOpen}
        onOpenChange={setGameNoPlatformDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notice</AlertDialogTitle>
            <AlertDialogDescription>
              Add a platform first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setGameNoPlatformDialogOpen(false)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
