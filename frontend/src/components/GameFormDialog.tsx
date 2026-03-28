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
import type { IVideoGame, IPlatform } from '@/types';

const FORMAT_OPTIONS = ['Physical', 'Digital'];
const COMPLETENESS_OPTIONS = [
  'New/Sealed',
  'CIB (Complete in Box)',
  'Game + Box',
  'Loose',
];
const REGION_OPTIONS = ['NTSC-U', 'PAL', 'NTSC-J', 'Region Free'];
const PLAY_STATE_OPTIONS = [
  'Unplayed',
  'Playing',
  'Beaten',
  'Completed',
  'Abandoned',
];

interface GameFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (game: Omit<IVideoGame, 'id' | 'platform'>) => void;
  game?: IVideoGame | null;
  platforms: IPlatform[];
}

export default function GameFormDialog({
  open,
  onOpenChange,
  onSave,
  game,
  platforms,
}: GameFormDialogProps) {
  const isEdit = !!game;

  const [title, setTitle] = useState('');
  const [platformId, setPlatformId] = useState('');
  const [format, setFormat] = useState('Physical');
  const [completeness, setCompleteness] = useState('New/Sealed');
  const [region, setRegion] = useState('NTSC-U');
  const [storeOrigin, setStoreOrigin] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('0');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [playState, setPlayState] = useState('Unplayed');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (game) {
        setTitle(game.title);
        setPlatformId(String(game.platformId));
        setFormat(game.format ?? 'Physical');
        setCompleteness(game.completeness ?? 'New/Sealed');
        setRegion(game.region ?? 'NTSC-U');
        setStoreOrigin(game.storeOrigin ?? '');
        setPurchasePrice(String(game.purchasePrice));
        setAcquisitionDate(game.acquisitionDate ?? '');
        setPlayState(game.playState ?? 'Unplayed');
      } else {
        setTitle('');
        setPlatformId(platforms.length > 0 ? String(platforms[0]?.id ?? '') : '');
        setFormat('Physical');
        setCompleteness('New/Sealed');
        setRegion('NTSC-U');
        setStoreOrigin('');
        setPurchasePrice('0');
        setAcquisitionDate('');
        setPlayState('Unplayed');
      }
      setError('');
    }
  }, [open, game, platforms]);

  const handleSave = () => {
    if (!title.trim() || !platformId) {
      setError('Title and Platform are required.');
      return;
    }

    let price = parseFloat(purchasePrice);
    if (isNaN(price)) {
      price = 0;
    }

    onSave({
      title: title.trim(),
      platformId: parseInt(platformId, 10),
      format,
      completeness,
      region,
      storeOrigin: storeOrigin.trim(),
      purchasePrice: price,
      acquisitionDate: acquisitionDate.trim() || null,
      playState,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Game' : 'Add New Game'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the game details below.'
              : 'Fill in the details for the new game.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="gameTitle">Title*</Label>
            <Input
              id="gameTitle"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Game title"
              autoFocus
            />
          </div>

          {/* Platform */}
          <div className="grid gap-2">
            <Label>Platform*</Label>
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

          {/* Format */}
          <div className="grid gap-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Completeness */}
          <div className="grid gap-2">
            <Label>Completeness</Label>
            <Select value={completeness} onValueChange={setCompleteness}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPLETENESS_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Region */}
          <div className="grid gap-2">
            <Label>Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGION_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Store/Origin */}
          <div className="grid gap-2">
            <Label htmlFor="storeOrigin">Store/Origin</Label>
            <Input
              id="storeOrigin"
              value={storeOrigin}
              onChange={(e) => setStoreOrigin(e.target.value)}
            />
          </div>

          {/* Purchase Price */}
          <div className="grid gap-2">
            <Label htmlFor="purchasePrice">Purchase Price</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          {/* Acquisition Date */}
          <div className="grid gap-2">
            <Label htmlFor="acquisitionDate">Acquisition Date (YYYY-MM-DD)</Label>
            <Input
              id="acquisitionDate"
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          {/* Play State */}
          <div className="grid gap-2">
            <Label>Play State</Label>
            <Select value={playState} onValueChange={setPlayState}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAY_STATE_OPTIONS.map((opt) => (
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
          <Button onClick={handleSave}>Save Game</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
