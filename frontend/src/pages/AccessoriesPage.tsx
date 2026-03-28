import {
  useAccessories,
  useAddAccessory,
  useUpdateAccessory,
  useDeleteAccessory,
} from '@/hooks/useAccessories';
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
import AccessoryFormDialog from '@/components/AccessoryFormDialog';
import type { IAccessory, ApiError } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function AccessoriesPage() {
  const { data: accessories, isLoading, isError, error, refetch } = useAccessories();
  const addMutation = useAddAccessory();
  const updateMutation = useUpdateAccessory();
  const deleteMutation = useDeleteAccessory();

  // Zustand store state & actions
  const {
    selectedAccessory,
    formDialogOpen,
    editMode,
    deleteDialogOpen,
  } = useInventoryStore((s) => s.accessories);

  const {
    setSelectedAccessory,
    setAccessoryFormDialogOpen,
    setAccessoryEditMode,
    setAccessoryDeleteDialogOpen,
    resetAccessorySelection,
  } = useInventoryStore();

  const handleAdd = () => {
    setAccessoryEditMode(false);
    setAccessoryFormDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedAccessory) return;
    setAccessoryEditMode(true);
    setAccessoryFormDialogOpen(true);
  };

  const handleSave = (data: Omit<IAccessory, 'id'>) => {
    if (editMode && selectedAccessory) {
      updateMutation.mutate(
        { id: selectedAccessory.id, data },
        {
          onSuccess: () => {
            setAccessoryFormDialogOpen(false);
            resetAccessorySelection();
          },
          onError: (err) => {
            const apiErr = (err as Error & { apiError?: ApiError }).apiError;
            console.error('Update failed:', apiErr?.message ?? err.message);
          },
        }
      );
    } else {
      addMutation.mutate(data, {
        onSuccess: () => {
          setAccessoryFormDialogOpen(false);
        },
        onError: (err) => {
          const apiErr = (err as Error & { apiError?: ApiError }).apiError;
          console.error('Add failed:', apiErr?.message ?? err.message);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedAccessory) return;
    deleteMutation.mutate(selectedAccessory.id, {
      onSuccess: () => {
        setAccessoryDeleteDialogOpen(false);
        resetAccessorySelection();
      },
      onError: (err) => {
        const apiErr = (err as Error & { apiError?: ApiError }).apiError;
        console.error('Delete failed:', apiErr?.message ?? err.message);
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Accessories</h2>

      {/* Action bar */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Accessory
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedAccessory}
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit Accessory
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={!selectedAccessory}
          onClick={() => setAccessoryDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Accessory
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading accessories...</p>
      ) : isError ? (
        <p className="text-destructive">
          {(error as Error & { apiError?: ApiError })?.apiError?.message ?? 'Failed to load accessories.'}
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Connectivity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessories && accessories.length > 0 ? (
                accessories.map((acc) => (
                  <TableRow
                    key={acc.id}
                    className={cn(
                      'cursor-pointer',
                      selectedAccessory?.id === acc.id && 'bg-muted'
                    )}
                    onClick={() =>
                      setSelectedAccessory(
                        selectedAccessory?.id === acc.id ? null : acc
                      )
                    }
                    data-state={
                      selectedAccessory?.id === acc.id ? 'selected' : undefined
                    }
                  >
                    <TableCell>{acc.id}</TableCell>
                    <TableCell>{acc.type}</TableCell>
                    <TableCell>{acc.brand}</TableCell>
                    <TableCell>{acc.connectivity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No accessories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Accessory Form Dialog */}
      <AccessoryFormDialog
        open={formDialogOpen}
        onOpenChange={setAccessoryFormDialogOpen}
        onSave={handleSave}
        accessory={editMode ? selectedAccessory : null}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setAccessoryDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>
              Delete accessory &apos;{selectedAccessory?.brand}&apos;?
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
    </div>
  );
}
