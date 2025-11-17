'use client';

import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Cargando...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
