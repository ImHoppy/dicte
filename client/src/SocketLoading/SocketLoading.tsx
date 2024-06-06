import React, { FC, useEffect } from 'react';
import { socket } from '../socket.io';
import S from './SocketLoading.module.scss';

export const SocketLoading: FC<{ children: React.ReactNode; }> = ({ children }) => {
	const [isConnected, setIsConnected] = React.useState(false);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
		};
	}, []);

	if (!isConnected) {
		return (
			<div className={S.main}>
				<div className={S.loading}>
					<div className={S['loading-icon']}>⌛</div>
					{/* <div className={S['loading-text']}>Connection en cours</div> */}
				</div>
			</div >
		);
	}
	return children;
}