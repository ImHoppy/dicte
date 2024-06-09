import { forwardRef, useState } from "react";
import { useSocketEvent } from "../socket.io";
import { GameState } from "./App";

export const AudioPlayer = forwardRef<HTMLAudioElement>((_, audioRef) => {
	const [audioSource, setAudioSource] = useState('');

	useSocketEvent('audioUrl', (url: string) => {
		setAudioSource(url);
	});

	useSocketEvent('state', ({ audioPaused, audioTime }: GameState) => {
		if (!audioRef) return;
		const ref = (audioRef as React.RefObject<HTMLAudioElement>);
		if (!ref.current) return;

		ref.current.currentTime = audioTime;
		if (audioPaused) {
			ref.current.pause();
		} else {
			ref.current.play();
		}
	});

	return (
		<audio
			ref={audioRef}
			src={audioSource}
		/>
	);
});