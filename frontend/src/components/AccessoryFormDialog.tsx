import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Accessory } from '@/types';

const CONNECTIVITY_OPTIONS = [
  'Wired',
  'Wireless',
  'Bluetooth',
  'Proprietary',
  'Other',
];

interface AccessoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<Accessory, 'id'>) => void;
  accessory?: Accessory | null;
}

export default function AccessoryFormDialog({
  open,
  onOpenChange,
  onSave,
  accessory,
}: AccessoryFormDialogProps) {
  const isEdit = !!accessory;

  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [connectivity, setConnectivity] = useState('Wired');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (accessory) {
        setType(accessory.type);
        setBrand(accessory.brand ?? '');
        setConnectivity(accessory.connectivity ?? 'Wired');
      } else {
        setType('');
        setBrand('');
        setConnectivity('Wired');
      }
      setError('');
    }
  }, [open, accessory]);

  const handleSave = () => {
    if (!type.trim() || !brand.trim()) {
      setError('Type and Brand are required.');
      return;
    }

    onSave({
      type: type.trim(),
      brand: brand.trim(),
      connectivity,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Accessory' : 'Add New Accessory'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the accessory details below.'
              : 'Fill in the details for the new accessory.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="accessoryType">Type*</Label>
            <Input
              id="accessoryType"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Controller, Headset"
              autoFocus
            />
          </div>

          {/* Brand */}
          <div className="grid gap-2">
            <Label htmlFor="accessoryBrand">Brand*</Label>
            <Input
              id="accessoryBrand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          {/* Connectivity */}
          <div className="grid gap-2">
            <Label>Connectivity</Label>
            <Select value={connectivity} onValueChange={setConnectivity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONNECTIVITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Validation error */}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Accessory</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
