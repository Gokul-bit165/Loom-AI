import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading deterministic plant analytics...' }: LoadingStateProps) {
  return (
    <div className="card-industrial flex flex-col items-center justify-center p-12 text-center my-6">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <span className="text-sm font-medium text-slate-700">{message}</span>
      <span className="text-xs text-slate-400 mt-1">Connecting to PostgreSQL analytics engine...</span>
    </div>
  );
}
