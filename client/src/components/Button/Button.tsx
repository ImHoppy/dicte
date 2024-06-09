import classNames from 'classnames';
import S from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {

	return (
		<button {...props} className={classNames(S.button, props.className)}>{children}</button>
	);
}

