import { useEffect } from 'react';
import styles from './toast.module.scss';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
	message: string;
	type: ToastType;
	onClose: () => void;
	duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 4000 }: ToastProps) => {
	useEffect(() => {
		const timer = setTimeout(onClose, duration);
		return () => clearTimeout(timer);
	}, [duration, onClose]);

	return (
		<div className={`${styles.toast} ${styles[`toast--${type}`]}`} role='alert'>
			<span className={styles.toast__message}>{message}</span>
			<button type='button' className={styles.toast__close} onClick={onClose} aria-label='Закрыть'>
				×
			</button>
		</div>
	);
};
