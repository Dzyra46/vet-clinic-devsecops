export type UserRole = 'admin' | 'doctor' | 'pet-owner';
export type ActionType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'generate_qr';

export interface LogEntry {
  id: string;
  timestamp: string; // ISO
  user: string;
  userRole: UserRole;
  action: ActionType;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

const STORAGE_KEY = 'audit_logs';
const CHANGE_EVENT = 'audit:logs-changed';

export function getLogs(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as LogEntry[]; } catch { return []; }
}

export function seedIfEmpty(seed: LogEntry[]) {
  if (typeof window === 'undefined') return;
  const existing = getLogs();
  if (existing.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function addLog(partial: Omit<LogEntry, 'id' | 'timestamp' | 'ipAddress' | 'status'> & Partial<Pick<LogEntry,'timestamp'|'ipAddress'|'status'>>): LogEntry {
  const logs = getLogs();
  const entry: LogEntry = {
    id: String(Date.now()) + '-' + Math.floor(Math.random()*1000),
    timestamp: partial.timestamp || new Date().toISOString(),
    ipAddress: partial.ipAddress || '127.0.0.1',
    status: partial.status || 'success',
    user: partial.user,
    userRole: partial.userRole,
    action: partial.action,
    resource: partial.resource,
    details: partial.details,
  };
  logs.unshift(entry);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
  return entry;
}

export function onLogsChanged(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => cb();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) cb(); });
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}
