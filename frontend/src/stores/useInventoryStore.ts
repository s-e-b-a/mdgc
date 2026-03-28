import { create } from 'zustand';
import type { IVideoGame, IPlatform, IConsole, IAccessory } from '@/types';

// ── TypeScript interfaces for the store ────────────────────────────────

/** UI state for any entity list page (dialog open flags, edit mode). */
export interface EntityUIState {
  formDialogOpen: boolean;
  editMode: boolean;
  deleteDialogOpen: boolean;
}

/** Selection + UI state for the Video Games page. */
export interface VideoGameSlice extends EntityUIState {
  selectedGame: IVideoGame | null;
  noPlatformDialogOpen: boolean;
}

/** Selection + UI state for the Platforms page. */
export interface PlatformSlice extends EntityUIState {
  selectedPlatform: IPlatform | null;
  errorDialogOpen: boolean;
  errorMessage: string;
}

/** Selection + UI state for the Hardware page. */
export interface HardwareSlice extends EntityUIState {
  selectedConsole: IConsole | null;
  noPlatformDialogOpen: boolean;
}

/** Selection + UI state for the Accessories page. */
export interface AccessorySlice extends EntityUIState {
  selectedAccessory: IAccessory | null;
}

/** Root state shape of the inventory store. */
export interface InventoryStoreState {
  videoGames: VideoGameSlice;
  platforms: PlatformSlice;
  hardware: HardwareSlice;
  accessories: AccessorySlice;
}

/** Actions exposed by the inventory store. */
export interface InventoryStoreActions {
  // Video Games actions
  setSelectedGame: (game: IVideoGame | null) => void;
  setGameFormDialogOpen: (open: boolean) => void;
  setGameEditMode: (edit: boolean) => void;
  setGameDeleteDialogOpen: (open: boolean) => void;
  setGameNoPlatformDialogOpen: (open: boolean) => void;
  resetGameSelection: () => void;

  // Platforms actions
  setSelectedPlatform: (platform: IPlatform | null) => void;
  setPlatformDialogOpen: (open: boolean) => void;
  setPlatformEditMode: (edit: boolean) => void;
  setPlatformDeleteDialogOpen: (open: boolean) => void;
  setPlatformErrorDialog: (open: boolean, message?: string) => void;
  resetPlatformSelection: () => void;

  // Hardware actions
  setSelectedConsole: (console: IConsole | null) => void;
  setHardwareFormDialogOpen: (open: boolean) => void;
  setHardwareEditMode: (edit: boolean) => void;
  setHardwareDeleteDialogOpen: (open: boolean) => void;
  setHardwareNoPlatformDialogOpen: (open: boolean) => void;
  resetHardwareSelection: () => void;

  // Accessories actions
  setSelectedAccessory: (accessory: IAccessory | null) => void;
  setAccessoryFormDialogOpen: (open: boolean) => void;
  setAccessoryEditMode: (edit: boolean) => void;
  setAccessoryDeleteDialogOpen: (open: boolean) => void;
  resetAccessorySelection: () => void;
}

// ── Default slices ─────────────────────────────────────────────────────

const defaultVideoGameSlice: VideoGameSlice = {
  selectedGame: null,
  formDialogOpen: false,
  editMode: false,
  deleteDialogOpen: false,
  noPlatformDialogOpen: false,
};

const defaultPlatformSlice: PlatformSlice = {
  selectedPlatform: null,
  formDialogOpen: false,
  editMode: false,
  deleteDialogOpen: false,
  errorDialogOpen: false,
  errorMessage: '',
};

const defaultHardwareSlice: HardwareSlice = {
  selectedConsole: null,
  formDialogOpen: false,
  editMode: false,
  deleteDialogOpen: false,
  noPlatformDialogOpen: false,
};

const defaultAccessorySlice: AccessorySlice = {
  selectedAccessory: null,
  formDialogOpen: false,
  editMode: false,
  deleteDialogOpen: false,
};

// ── Store creation ─────────────────────────────────────────────────────

export const useInventoryStore = create<InventoryStoreState & InventoryStoreActions>()(
  (set) => ({
    // ── Initial state ──────────────────────────────────────────────────
    videoGames: { ...defaultVideoGameSlice },
    platforms: { ...defaultPlatformSlice },
    hardware: { ...defaultHardwareSlice },
    accessories: { ...defaultAccessorySlice },

    // ── Video Games actions ────────────────────────────────────────────
    setSelectedGame: (game) =>
      set((state) => ({ videoGames: { ...state.videoGames, selectedGame: game } })),
    setGameFormDialogOpen: (open) =>
      set((state) => ({ videoGames: { ...state.videoGames, formDialogOpen: open } })),
    setGameEditMode: (edit) =>
      set((state) => ({ videoGames: { ...state.videoGames, editMode: edit } })),
    setGameDeleteDialogOpen: (open) =>
      set((state) => ({ videoGames: { ...state.videoGames, deleteDialogOpen: open } })),
    setGameNoPlatformDialogOpen: (open) =>
      set((state) => ({ videoGames: { ...state.videoGames, noPlatformDialogOpen: open } })),
    resetGameSelection: () =>
      set((state) => ({ videoGames: { ...state.videoGames, selectedGame: null } })),

    // ── Platforms actions ──────────────────────────────────────────────
    setSelectedPlatform: (platform) =>
      set((state) => ({ platforms: { ...state.platforms, selectedPlatform: platform } })),
    setPlatformDialogOpen: (open) =>
      set((state) => ({ platforms: { ...state.platforms, formDialogOpen: open } })),
    setPlatformEditMode: (edit) =>
      set((state) => ({ platforms: { ...state.platforms, editMode: edit } })),
    setPlatformDeleteDialogOpen: (open) =>
      set((state) => ({ platforms: { ...state.platforms, deleteDialogOpen: open } })),
    setPlatformErrorDialog: (open, message) =>
      set((state) => ({
        platforms: {
          ...state.platforms,
          errorDialogOpen: open,
          errorMessage: message ?? state.platforms.errorMessage,
        },
      })),
    resetPlatformSelection: () =>
      set((state) => ({ platforms: { ...state.platforms, selectedPlatform: null } })),

    // ── Hardware actions ───────────────────────────────────────────────
    setSelectedConsole: (console) =>
      set((state) => ({ hardware: { ...state.hardware, selectedConsole: console } })),
    setHardwareFormDialogOpen: (open) =>
      set((state) => ({ hardware: { ...state.hardware, formDialogOpen: open } })),
    setHardwareEditMode: (edit) =>
      set((state) => ({ hardware: { ...state.hardware, editMode: edit } })),
    setHardwareDeleteDialogOpen: (open) =>
      set((state) => ({ hardware: { ...state.hardware, deleteDialogOpen: open } })),
    setHardwareNoPlatformDialogOpen: (open) =>
      set((state) => ({ hardware: { ...state.hardware, noPlatformDialogOpen: open } })),
    resetHardwareSelection: () =>
      set((state) => ({ hardware: { ...state.hardware, selectedConsole: null } })),

    // ── Accessories actions ────────────────────────────────────────────
    setSelectedAccessory: (accessory) =>
      set((state) => ({ accessories: { ...state.accessories, selectedAccessory: accessory } })),
    setAccessoryFormDialogOpen: (open) =>
      set((state) => ({ accessories: { ...state.accessories, formDialogOpen: open } })),
    setAccessoryEditMode: (edit) =>
      set((state) => ({ accessories: { ...state.accessories, editMode: edit } })),
    setAccessoryDeleteDialogOpen: (open) =>
      set((state) => ({ accessories: { ...state.accessories, deleteDialogOpen: open } })),
    resetAccessorySelection: () =>
      set((state) => ({ accessories: { ...state.accessories, selectedAccessory: null } })),
  })
);
