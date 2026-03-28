import {
  usePlatforms,
  useAddPlatform,
  useUpdatePlatform,
  useDeletePlatform,
} from '@/hooks/usePlatforms';
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
import PlatformDialog from '@/components/PlatformDialog';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function PlatformsPage() {
  const { data: platforms, isLoading, refetch } = usePlatforms();
  const addMutation = useAddPlatform();
  const updateMutation = useUpdatePlatform();
  const deleteMutation = useDeletePlatform();

  // Zustand store state & actions
  const {
    selectedPlatform,
    formDialogOpen: dialogOpen,
    editMode,
    deleteDialogOpen,
    errorDialogOpen,
    errorMessage,
  } = useInventoryStore((s) => s.platforms);

  const {
    setSelectedPlatform,
    setPlatformDialogOpen,
    setPlatformEditMode,
    setPlatformDeleteDialogOpen,
    setPlatformErrorDialog,
    resetPlatformSelection,
  } = useInventoryStore();

  const handleAdd = () => {
    setPlatformEditMode(false);
    setPlatformDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedPlatform) return;
    setPlatformEditMode(true);
    setPlatformDialogOpen(true);
  };

  const handleSave = (name: string) => {
    if (editMode && selectedPlatform) {
      updateMutation.mutate(
        { id: selectedPlatform.id, data: { name } },
        {
          onSuccess: () => {
            setPlatformDialogOpen(false);
            resetPlatformSelection();
          },
        }
      );
    } else {
      addMutation.mutate(
        { name },
        {
          onSuccess: () => {
            setPlatformDialogOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedPlatform) return;
    deleteMutation.mutate(selectedPlatform.id, {
      onSuccess: () => {
        setPlatformDeleteDialogOpen(false);
        resetPlatformSelection();
      },
      onError: () => {
        setPlatformDeleteDialogOpen(false);
        setPlatformErrorDialog(true, 'Ensure no games/hardware are linked to it.');
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
          onClick={() => setPlatformDeleteDialogOpen(true)}
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
        onOpenChange={setPlatformDialogOpen}
        onSave={handleSave}
        platform={editMode ? selectedPlatform : null}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setPlatformDeleteDialogOpen}>
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
      <AlertDialog open={errorDialogOpen} onOpenChange={(open) => setPlatformErrorDialog(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setPlatformErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
