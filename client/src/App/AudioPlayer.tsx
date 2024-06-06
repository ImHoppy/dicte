import { useEffect, useRef, useState } from "react"
import { socket } from "../socket.io";

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [audioSource, setAudioSource] = useState('');
	const [audioPlaying, setAudioPlaying] = useState(false);

	useEffect(() => {
		socket.on('audio-data', (data) => {
			const { url, playing } = data;
			setAudioSource(url);
			setAudioPlaying(playing);
		});

		return () => {
			socket.off('audio-data');
		};
	}, []);

	useEffect(() => {
		if (audioRef.current && audioSource) {
			audioRef.current.src = audioSource;
			if (audioPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [audioSource, audioPlaying]);

	return (
		<audio ref={audioRef} />
	);
};