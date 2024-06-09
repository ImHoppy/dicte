import { FC, useRef } from "react";
import S from './UsernameInput.module.scss';
import { Button } from "../Button/Button";

export const UsernameInput: FC<{
	onSubmit: (username: string) => void;
}> = ({ onSubmit }) => {

	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={S.container}>
			<div className={S.main}>
				<input
					defaultValue={localStorage.getItem('username') || ''}
					className={S.input}
					ref={inputRef}
					type="text"
					placeholder="Username"
				/>
				<Button
					onClick={() => {
						const username = inputRef.current?.value.trim();
						if (username && username.length > 2) {
							onSubmit(username);
						}
					}}
				>
					Continuer
				</Button>
			</div>
		</div>
	)
}