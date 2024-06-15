'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { ReactFlowProvider } from 'reactflow';

export function AppProviders({ children, ...props }: ThemeProviderProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider {...props}>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
