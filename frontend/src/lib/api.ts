import type {
  IPlatform,
  IVideoGame,
  IConsole,
  IAccessory,
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

export function getAllVideoGames(): Promise<IVideoGame[]> {
  return request<IVideoGame[]>('/videogames');
}

export function addVideoGame(data: Omit<IVideoGame, 'id'>): Promise<IVideoGame> {
  return request<IVideoGame>('/videogames', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateVideoGame(
  id: number,
  data: Partial<IVideoGame>,
): Promise<IVideoGame> {
  return request<IVideoGame>(`/videogames/${id}`, {
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

export function getAllPlatforms(): Promise<IPlatform[]> {
  return request<IPlatform[]>('/platforms');
}

export function addPlatform(data: Omit<IPlatform, 'id'>): Promise<IPlatform> {
  return request<IPlatform>('/platforms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePlatform(
  id: number,
  data: Partial<IPlatform>,
): Promise<IPlatform> {
  return request<IPlatform>(`/platforms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePlatform(id: number): Promise<void> {
  return request<void>(`/platforms/${id}`, { method: 'DELETE' });
}

// ── Consoles ─────────────────────────────────────────────────────────────────

export function getAllConsoles(): Promise<IConsole[]> {
  return request<IConsole[]>('/consoles');
}

export function addConsole(data: Omit<IConsole, 'id'>): Promise<IConsole> {
  return request<IConsole>('/consoles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateConsole(
  id: number,
  data: Partial<IConsole>,
): Promise<IConsole> {
  return request<IConsole>(`/consoles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteConsole(id: number): Promise<void> {
  return request<void>(`/consoles/${id}`, { method: 'DELETE' });
}

// ── Accessories ──────────────────────────────────────────────────────────────

export function getAllAccessories(): Promise<IAccessory[]> {
  return request<IAccessory[]>('/accessories');
}

export function addAccessory(data: Omit<IAccessory, 'id'>): Promise<IAccessory> {
  return request<IAccessory>('/accessories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAccessory(
  id: number,
  data: Partial<IAccessory>,
): Promise<IAccessory> {
  return request<IAccessory>(`/accessories/${id}`, {
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
