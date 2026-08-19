/**
 * @file Badge.tsx
 * @description Típusbiztos státusz- és metaadatcímke komponens.
 */

import type { JSX, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'danger' | 'success' | 'warning' | 'info';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  danger: 'bg-red-950/60 text-red-400 border-red-900/80',
  success: 'bg-emerald-950/60 text-emerald-400 border-emerald-900/80',
  warning: 'bg-amber-950/60 text-amber-400 border-amber-900/80',
  info: 'bg-indigo-950/60 text-indigo-400 border-indigo-900/80',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps): JSX.Element {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-mono border px-2 py-0.5 rounded ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}