/**
 * TypeScript interfaces matching the JSON response shapes from the original Java models.
 * These interfaces define the DTOs used in API responses, preserving the same
 * field names and types as the original SOAP/XML responses converted to JSON.
 */

/**
 * Platform interface matching Java Platform model.
 */
export interface IPlatform {
  id: number;
  name: string;
}

/**
 * VideoGame interface matching Java VideoGame model.
 * Includes platform name as a string field (matching the original Java response
 * which included both platformId and the platform name string).
 * acquisitionDate is serialized as string|null (matching Java's Date.toString() behavior).
 */
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

/**
 * Console interface matching Java Console model.
 * Includes platformName field (matching the Java LEFT JOIN behavior).
 */
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

/**
 * Accessory interface matching Java Accessory model.
 */
export interface IAccessory {
  id: number;
  type: string;
  brand: string | null;
  connectivity: string | null;
}

/**
 * Loan interface matching Java Loan model.
 */
export interface ILoan {
  id: number;
  itemType: string;
  itemId: number;
  borrowerName: string;
  loanDate: string;
  returnDate: string | null;
  status: string;
}
