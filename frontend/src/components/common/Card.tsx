/**
 * @file Card.tsx
 * @description Univerzális panel/kártya keret komponens.
 */

import type { JSX, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <div
      className={`bg-slate-900/70 border border-slate-800 rounded-xl p-5 md:p-6 backdrop-blur-sm shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}