import { FC, useEffect, useState } from 'react';

interface TimerProps {
	defaultTimer: number;
	paused: boolean;
}

export const Timer: FC<TimerProps> = ({ defaultTimer = 0, paused = false }) => {
	const [timer, setTimer] = useState(defaultTimer);

	useEffect(() => {
		if (!paused) {
			const interval = setInterval(() => {
				setTimer((timer) => timer + 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [paused]);

	return (
		new Date(timer * 1000).toISOString().slice(11, 11 + 8)
	);
}