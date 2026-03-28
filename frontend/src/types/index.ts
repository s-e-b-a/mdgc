// TypeScript interfaces matching the backend models

export interface IPlatform {
  id: number;
  name: string;
}

export interface IVideoGame {
  id: number;
  title: string;
  platformId: number;
  platform: string | null;
  format: string | null;
  completeness: string | null;
  region: string | null;
  storeOrigin: string | null;
  purchasePrice: number;
  acquisitionDate: string | null;
  playState: string | null;
}

export interface IConsole {
  id: number;
  platformId: number | null;
  platformName: string | null;
  model: string;
  serialNumber: string | null;
  colorEdition: string | null;
  status: string | null;
  storageCapacity: string | null;
  includedCables: string | null;
}

export interface IAccessory {
  id: number;
  type: string;
  brand: string | null;
  connectivity: string | null;
}

export interface ILoan {
  id: number;
  itemType: string;
  itemId: number;
  borrowerName: string;
  loanDate: string;
  returnDate: string | null;
  status: string;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface CollectionValue {
  value: number;
}

export interface PingResponse {
  message: string;
}

export interface StatisticsReport {
  totalVideoGames: number;
  totalConsoles: number;
  totalAccessories: number;
  totalCollectionValue: number;
  gamesByPlatform: Array<{ name: string; count: number }>;
  gamesByPlayState: Array<{ playState: string; count: number }>;
}
