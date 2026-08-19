/**
 * @file Button.tsx
 * @description Standardizált műveleti gomb komponens betöltési állapottal.
 */

import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function Button({
  children,
  isLoading = false,
  loadingText = 'Folyamatban...',
  icon,
  className = '',
  disabled,
  ...restProps
}: ButtonProps): JSX.Element {
  return (
    <button
      disabled={isLoading || disabled}
      className={`w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-150 shadow-sm ${className}`}
      {...restProps}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}