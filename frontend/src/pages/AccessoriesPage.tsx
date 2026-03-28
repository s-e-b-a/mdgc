import { useState } from 'react';
import {
  useAccessories,
  useAddAccessory,
  useUpdateAccessory,
  useDeleteAccessory,
} from '@/hooks/useAccessories';
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
import type { Accessory } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function AccessoriesPage() {
  const { data: accessories, isLoading, refetch } = useAccessories();
  const addMutation = useAddAccessory();
  const updateMutation = useUpdateAccessory();
  const deleteMutation = useDeleteAccessory();

  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(
    null
  );
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAdd = () => {
    setEditMode(false);
    setFormDialogOpen(true);
  };

  const handleEdit = () => {
    if (!selectedAccessory) return;
    setEditMode(true);
    setFormDialogOpen(true);
  };

  const handleSave = (data: Omit<Accessory, 'id'>) => {
    if (editMode && selectedAccessory) {
      updateMutation.mutate(
        { id: selectedAccessory.id, data },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setSelectedAccessory(null);
          },
        }
      );
    } else {
      addMutation.mutate(data, {
        onSuccess: () => {
          setFormDialogOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedAccessory) return;
    deleteMutation.mutate(selectedAccessory.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedAccessory(null);
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
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Accessory
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading accessories...</p>
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
        onOpenChange={setFormDialogOpen}
        onSave={handleSave}
        accessory={editMode ? selectedAccessory : null}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
