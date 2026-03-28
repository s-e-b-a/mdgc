import type {
  Platform,
  VideoGame,
  Console,
  Accessory,
  StatisticsReport,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ── Video Games ──────────────────────────────────────────────────────────────

export function getAllVideoGames(): Promise<VideoGame[]> {
  return request<VideoGame[]>('/videogames');
}

export function addVideoGame(data: Omit<VideoGame, 'id'>): Promise<VideoGame> {
  return request<VideoGame>('/videogames', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateVideoGame(
  id: number,
  data: Partial<VideoGame>,
): Promise<VideoGame> {
  return request<VideoGame>(`/videogames/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteVideoGame(id: number): Promise<void> {
  return request<void>(`/videogames/${id}`, { method: 'DELETE' });
}

export function getTotalCollectionValue(): Promise<number> {
  return request<number>('/videogames/value');
}

// ── Platforms ────────────────────────────────────────────────────────────────

export function getAllPlatforms(): Promise<Platform[]> {
  return request<Platform[]>('/platforms');
}

export function addPlatform(data: Omit<Platform, 'id'>): Promise<Platform> {
  return request<Platform>('/platforms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePlatform(
  id: number,
  data: Partial<Platform>,
): Promise<Platform> {
  return request<Platform>(`/platforms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePlatform(id: number): Promise<void> {
  return request<void>(`/platforms/${id}`, { method: 'DELETE' });
}

// ── Consoles ─────────────────────────────────────────────────────────────────

export function getAllConsoles(): Promise<Console[]> {
  return request<Console[]>('/consoles');
}

export function addConsole(data: Omit<Console, 'id'>): Promise<Console> {
  return request<Console>('/consoles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateConsole(
  id: number,
  data: Partial<Console>,
): Promise<Console> {
  return request<Console>(`/consoles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteConsole(id: number): Promise<void> {
  return request<void>(`/consoles/${id}`, { method: 'DELETE' });
}

// ── Accessories ──────────────────────────────────────────────────────────────

export function getAllAccessories(): Promise<Accessory[]> {
  return request<Accessory[]>('/accessories');
}

export function addAccessory(data: Omit<Accessory, 'id'>): Promise<Accessory> {
  return request<Accessory>('/accessories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAccessory(
  id: number,
  data: Partial<Accessory>,
): Promise<Accessory> {
  return request<Accessory>(`/accessories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteAccessory(id: number): Promise<void> {
  return request<void>(`/accessories/${id}`, { method: 'DELETE' });
}

// ── Statistics ───────────────────────────────────────────────────────────────

export function getStatisticsReport(): Promise<StatisticsReport> {
  return request<StatisticsReport>('/statistics');
}
