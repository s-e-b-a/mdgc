import { useState } from 'react';
import {
  useConsoles,
  useAddConsole,
  useUpdateConsole,
  useDeleteConsole,
} from '@/hooks/useConsoles';
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
import ConsoleFormDialog from '@/components/ConsoleFormDialog';
import type { Console } from '@/types';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';

export default function HardwarePage() {
  const { data: consoles, isLoading, refetch } = useConsoles();
  const { data: platforms } = usePlatforms();
  const addMutation = useAddConsole();
  const updateMutation = useUpdateConsole();
  const deleteMutation = useDeleteConsole();

  const [selectedConsole, setSelectedConsole] = useState<Console | null>(null);
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
    if (!selectedConsole) return;
    setEditMode(true);
    setFormDialogOpen(true);
  };

  const handleSave = (data: Omit<Console, 'id' | 'platformName'>) => {
    const payload = { ...data, platformName: null };
    if (editMode && selectedConsole) {
      updateMutation.mutate(
        { id: selectedConsole.id, data: payload },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setSelectedConsole(null);
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
    if (!selectedConsole) return;
    deleteMutation.mutate(selectedConsole.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedConsole(null);
      },
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Hardware</h2>

      {/* Action bar */}
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Hardware
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!selectedConsole}
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit Hardware
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={!selectedConsole}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Hardware
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading consoles...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Cables</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consoles && consoles.length > 0 ? (
                consoles.map((c) => (
                  <TableRow
                    key={c.id}
                    className={cn(
                      'cursor-pointer',
                      selectedConsole?.id === c.id && 'bg-muted'
                    )}
                    onClick={() =>
                      setSelectedConsole(
                        selectedConsole?.id === c.id ? null : c
                      )
                    }
                    data-state={
                      selectedConsole?.id === c.id ? 'selected' : undefined
                    }
                  >
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.platformName}</TableCell>
                    <TableCell>{c.model}</TableCell>
                    <TableCell>{c.serialNumber}</TableCell>
                    <TableCell>{c.colorEdition}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell>{c.storageCapacity}</TableCell>
                    <TableCell>{c.includedCables}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No consoles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Console Form Dialog */}
      <ConsoleFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSave={handleSave}
        console={editMode ? selectedConsole : null}
        platforms={platforms ?? []}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {selectedConsole?.model}?
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
              Add a platform base first.
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
