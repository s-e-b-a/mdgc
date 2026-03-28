import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Platform } from '@/types';

interface PlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  platform?: Platform | null;
}

export default function PlatformDialog({
  open,
  onOpenChange,
  onSave,
  platform,
}: PlatformDialogProps) {
  const [name, setName] = useState(platform?.name ?? '');
  const [error, setError] = useState('');

  const isEdit = !!platform;

  const handleSave = () => {
    if (!name.trim()) {
      setError('Platform name is required.');
      return;
    }
    onSave(name.trim());
    setName('');
    setError('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setName(platform?.name ?? '');
      setError('');
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Platform' : 'Enter Platform Name:'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the platform name below.'
              : 'Enter a name for the new platform.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter platform name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
