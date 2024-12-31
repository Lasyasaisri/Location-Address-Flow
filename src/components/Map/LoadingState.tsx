import React from 'react';

interface LoadingStateProps {
  error?: boolean;
  message?: string;
}

export default function LoadingState({ error, message }: LoadingStateProps) {
  return (
    <div className="w-full h-[300px] rounded-lg bg-gray-100 flex items-center justify-center">
      <p className={error ? 'text-red-500' : 'text-gray-500'}>
        {message || (error ? 'Error loading map. Please check your API key.' : 'Loading map...')}
      </p>
    </div>
  );
}