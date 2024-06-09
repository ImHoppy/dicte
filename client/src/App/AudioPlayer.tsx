import { useRef, useState } from "react"
import { useSocketEvent } from "../socket.io";

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioSource, setAudioSource] = useState('');

	useSocketEvent('audioUrl', (url: string) => {
		setAudioSource(url);
	});

	useSocketEvent('audioSync', ({ currentTime, isPlaying }) => {
		if (audioRef.current) {
			audioRef.current.currentTime = currentTime;
			if (isPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	});

	return (
		<audio
			ref={audioRef}
			src={audioSource}
		/>
	);
};