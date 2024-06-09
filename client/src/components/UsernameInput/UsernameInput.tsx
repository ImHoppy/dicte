import { FC, useRef } from "react";
import S from './UsernameInput.module.scss';

export const UsernameInput: FC<{
	onSubmit: (username: string) => void;
}> = ({ onSubmit }) => {

	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={S.container}>
			<div className={S.main}>
				<input
					className={S.input}
					ref={inputRef}
					type="text"
					placeholder="Username"
				/>
				<button
					className={S.button}
					onClick={() => {
						const username = inputRef.current?.value.trim();
						if (username && username.length > 2) {
							onSubmit(username);
						}
					}}
				>
					Continuer
				</button>
			</div>
		</div>
	)
}