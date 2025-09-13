// Hotjar TypeScript definitions
interface HotjarStatic {
  (action: 'trigger', eventName: string): void;
  (action: 'identify', userId: string, userAttributes?: Record<string, unknown>): void;
  (action: 'event', eventName: string): void;
  (action: 'stateChange', relativePath?: string): void;
  q: unknown[];
}

interface HotjarSettings {
  hjid: number;
  hjsv: number;
}

declare global {
  interface Window {
    hj: HotjarStatic;
    _hjSettings: HotjarSettings;
  }
}

export {};