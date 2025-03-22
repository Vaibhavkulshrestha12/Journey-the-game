// File: src/hooks/useSocket.ts
import { useContext } from 'react';
import { SocketContext, SocketContextType } from '@/context/SocketContext';

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};