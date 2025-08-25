export interface Trade {
  date: string;
  pnl: number;
  notes?: string;
}

export interface UserSettings {
  name: string;
  initialBalance: number;
  currentBalance: number;
}

export interface AppData {
  trades: Record<string, Trade>;
  settings: UserSettings;
}

export type ViewType = 'dashboard' | 'calendar' | 'settings';