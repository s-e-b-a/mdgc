import { useState } from 'react';
import {
  useVideoGames,
  useAddVideoGame,
  useUpdateVideoGame,
  useDeleteVideoGame,
} from '@/hooks/useVideoGames';
import { usePlatforms } from '@/hooks/usePlatforms';
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
import type { VideoGame } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function VideoGamesPage() {
  const { data: games, isLoading, refetch } = useVideoGames();
  const { data: platforms } = usePlatforms();
  const addMutation = useAddVideoGame();
  const updateMutation = useUpdateVideoGame();
  const deleteMutation = useDeleteVideoGame();

  const [selectedGame, setSelectedGame] = useState<VideoGame | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noPlatformDialogOpen, setNoPlatformDialogOpen] = useState(false);

  const handleAdd = () => {
    if (!platforms || platforms.length === 0) {
      setNoPlatformDialogOpen(true);
      return;
    }
    setEditMode(false);
    setFormDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedGame) return;
    setEditMode(true);
    setFormDialogOpen(true);
  };

  const handleSave = (data: Omit<VideoGame, 'id' | 'platform'>) => {
    const payload = { ...data, platform: null };
    if (editMode && selectedGame) {
      updateMutation.mutate(
        { id: selectedGame.id, data: payload },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setSelectedGame(null);
          },
        }
      );
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => {
          setFormDialogOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedGame) return;
    deleteMutation.mutate(selectedGame.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedGame(null);
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
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Game
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading video games...</p>
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
        onOpenChange={setFormDialogOpen}
        onSave={handleSave}
        game={editMode ? selectedGame : null}
        platforms={platforms ?? []}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
        onOpenChange={setNoPlatformDialogOpen}
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
              onClick={() => setNoPlatformDialogOpen(false)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
