import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io(import.meta.env.HOST, {
	path: '/ws/',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSocketEvent = (event: string, callback: (...args: any[]) => void) => {
	useEffect(() => {
		socket.on(event, callback);
		return () => {
			socket.off(event, callback);
		};
	}, [event, callback]);
};