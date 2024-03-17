import { useState, useEffect } from 'react';
import socket from './socketConnection';

type Response<T> = {
  table_name: string;
  content: T;
};

const useSocketListener = <T,>(
  room: string | null = null
): { data: T | null; error: Error | null } => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for data updates specific to the joined room
    const handleDataUpdate = (receivedData: Response<T>) => {
      if (receivedData?.table_name === room) {
        setData(receivedData.content); // Update the state with the received data
      }
    };

    socket.on('data_update', handleDataUpdate);

    return () => {
      socket.off('data_update', handleDataUpdate); // Remove the specific event listener
      if (room) {
        // If a room was joined, leave the room before disconnecting
        socket.emit('leave_room', { room });
      }
    };
  }, [room]); // Re-run the effect if the room changes

  return { data, error };
};

export default useSocketListener;

