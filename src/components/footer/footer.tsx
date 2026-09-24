import { type FormEvent, useState } from 'react';
import styles from './footer.module.scss';

interface FooterProps {
	onSend: (message: string) => void;
	isLoading: boolean;
}

export const Footer = ({ onSend, isLoading }: FooterProps) => {
	const [message, setMessage] = useState('');

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (message.trim() && !isLoading) {
			onSend(message);
			setMessage('');
		}
	};

	return (
		<footer className={styles.footer}>
			<form className={styles.footer__form} onSubmit={handleSubmit}>
				<input
					type='text'
					className={styles.footer__input}
					placeholder='Введите сообщение...'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					disabled={isLoading}
				/>
				<button type='submit' className={styles.footer__button} disabled={!message.trim() || isLoading}>
					{isLoading ? 'Отправка...' : 'Отправить'}
				</button>
			</form>
		</footer>
	);
};
