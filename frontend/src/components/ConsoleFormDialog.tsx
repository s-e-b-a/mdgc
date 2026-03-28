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
import type { Console, Platform } from '@/types';

const STATUS_OPTIONS = ['Functional', 'Needs Repair', 'Broken', 'Display Only'];

interface ConsoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<Console, 'id' | 'platformName'>) => void;
  console?: Console | null;
  platforms: Platform[];
}

export default function ConsoleFormDialog({
  open,
  onOpenChange,
  onSave,
  console: existingConsole,
  platforms,
}: ConsoleFormDialogProps) {
  const isEdit = !!existingConsole;

  const [platformId, setPlatformId] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [colorEdition, setColorEdition] = useState('');
  const [status, setStatus] = useState('Functional');
  const [storageCapacity, setStorageCapacity] = useState('');
  const [includedCables, setIncludedCables] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (existingConsole) {
        setPlatformId(
          existingConsole.platformId != null
            ? String(existingConsole.platformId)
            : ''
        );
        setModel(existingConsole.model);
        setSerialNumber(existingConsole.serialNumber ?? '');
        setColorEdition(existingConsole.colorEdition ?? '');
        setStatus(existingConsole.status ?? 'Functional');
        setStorageCapacity(existingConsole.storageCapacity ?? '');
        setIncludedCables(existingConsole.includedCables ?? '');
      } else {
        setPlatformId(platforms.length > 0 ? String(platforms[0]?.id ?? '') : '');
        setModel('');
        setSerialNumber('');
        setColorEdition('');
        setStatus('Functional');
        setStorageCapacity('');
        setIncludedCables('');
      }
      setError('');
    }
  }, [open, existingConsole, platforms]);

  const handleSave = () => {
    if (!model.trim() || !platformId) {
      setError('Platform and Model Name are required.');
      return;
    }

    onSave({
      platformId: parseInt(platformId, 10),
      model: model.trim(),
      serialNumber: serialNumber.trim() || null,
      colorEdition: colorEdition.trim() || null,
      status,
      storageCapacity: storageCapacity.trim() || null,
      includedCables: includedCables.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Console' : 'Add New Console'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the console details below.'
              : 'Fill in the details for the new console.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Platform Base */}
          <div className="grid gap-2">
            <Label>Platform Base*</Label>
            <Select value={platformId} onValueChange={setPlatformId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Name */}
          <div className="grid gap-2">
            <Label htmlFor="consoleModel">Model Name*</Label>
            <Input
              id="consoleModel"
              value={model}
              onChange={(e) => {
                setModel(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Slim, Pro"
              autoFocus
            />
          </div>

          {/* Serial Number */}
          <div className="grid gap-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          {/* Color / Edition */}
          <div className="grid gap-2">
            <Label htmlFor="colorEdition">Color / Edition</Label>
            <Input
              id="colorEdition"
              value={colorEdition}
              onChange={(e) => setColorEdition(e.target.value)}
            />
          </div>

          {/* Operating Status */}
          <div className="grid gap-2">
            <Label>Operating Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Storage Capacity */}
          <div className="grid gap-2">
            <Label htmlFor="storageCapacity">Storage Capacity</Label>
            <Input
              id="storageCapacity"
              value={storageCapacity}
              onChange={(e) => setStorageCapacity(e.target.value)}
              placeholder="e.g. 500GB, 1TB"
            />
          </div>

          {/* Included Cables/Mods */}
          <div className="grid gap-2">
            <Label htmlFor="includedCables">Included Cables/Mods</Label>
            <Input
              id="includedCables"
              value={includedCables}
              onChange={(e) => setIncludedCables(e.target.value)}
              placeholder="e.g. HDMI, Power, Modchip"
            />
          </div>

          {/* Validation error */}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Console</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
