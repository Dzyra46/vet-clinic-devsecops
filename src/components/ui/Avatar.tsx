import { ReactNode } from 'react';

export function Avatar({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
}

export function AvatarFallback({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>
      {children}
    </div>
  );
}
