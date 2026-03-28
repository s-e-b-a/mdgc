import { useState } from 'react';
import {
  usePlatforms,
  useAddPlatform,
  useUpdatePlatform,
  useDeletePlatform,
} from '@/hooks/usePlatforms';
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
import PlatformDialog from '@/components/PlatformDialog';
import type { Platform } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function PlatformsPage() {
  const { data: platforms, isLoading, refetch } = usePlatforms();
  const addMutation = useAddPlatform();
  const updateMutation = useUpdatePlatform();
  const deleteMutation = useDeletePlatform();

  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdd = () => {
    setEditMode(false);
    setDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedPlatform) return;
    setEditMode(true);
    setDialogOpen(true);
  };

  const handleSave = (name: string) => {
    if (editMode && selectedPlatform) {
      updateMutation.mutate(
        { id: selectedPlatform.id, data: { name } },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setSelectedPlatform(null);
          },
        }
      );
    } else {
      addMutation.mutate(
        { name },
        {
          onSuccess: () => {
            setDialogOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedPlatform) return;
    deleteMutation.mutate(selectedPlatform.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedPlatform(null);
      },
      onError: () => {
        setDeleteDialogOpen(false);
        setErrorMessage('Ensure no games/hardware are linked to it.');
        setErrorDialogOpen(true);
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Platforms</h2>

      {/* Action bar */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Platform
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedPlatform}
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit Platform
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={!selectedPlatform}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Platform
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading platforms...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {platforms && platforms.length > 0 ? (
                platforms.map((platform) => (
                  <TableRow
                    key={platform.id}
                    className={cn(
                      'cursor-pointer',
                      selectedPlatform?.id === platform.id && 'bg-muted'
                    )}
                    onClick={() =>
                      setSelectedPlatform(
                        selectedPlatform?.id === platform.id ? null : platform
                      )
                    }
                    data-state={
                      selectedPlatform?.id === platform.id ? 'selected' : undefined
                    }
                  >
                    <TableCell>{platform.id}</TableCell>
                    <TableCell>{platform.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No platforms found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <PlatformDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        platform={editMode ? selectedPlatform : null}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {selectedPlatform?.name}?
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

      {/* Error Dialog */}
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
