import { FC } from "react";
import ContentEditable from "react-contenteditable";
import S from "./TextBox.module.scss";

interface TextBoxProps {
	disable?: boolean;
	text: string;
	onTextChange?: (text: string) => void;
}

export const TextBox: FC<TextBoxProps> = ({ disable = false, text, onTextChange }) => {
	return (
		<ContentEditable
			disabled={disable}
			className={S.textbox}
			html={text}
			onChange={(e) => {
				onTextChange && onTextChange(e.target.value)
			}}
			onCopy={(e) => e.preventDefault()}
			onPaste={(e) => e.preventDefault()}
			onCut={(e) => e.preventDefault()}
		/>
	)
};