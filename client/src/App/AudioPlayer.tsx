import { useRef, useState } from "react";
import { useSocketEvent } from "../socket.io";
import { GameState } from "./App";

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioSource, setAudioSource] = useState('');

	useSocketEvent('audioUrl', (url: string) => {
		setAudioSource(url);
	});

	useSocketEvent('state', ({ audioPaused, audioTime }: GameState) => {
		if (!audioRef.current) return;

		audioRef.current.currentTime = audioTime;
		if (audioPaused) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
	});

	return (
		<audio
			ref={audioRef}
			src={audioSource}
		/>
	);
};