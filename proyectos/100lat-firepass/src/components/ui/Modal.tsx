'use client';

import { ReactNode } from 'react';

export default function Modal({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="fire-card w-full max-w-lg p-5">{children}</div>
    </div>
  );
}
