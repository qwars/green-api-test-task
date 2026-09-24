import { useLayoutEffect, useRef } from 'react';
import type { Message } from '../../types/green-api';
import styles from './main.module.scss';

interface MainProps {
	messages: Message[];
}

export const Main = ({ messages }: MainProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	return (
		<main className={styles.main}>
			<div className={styles.main__messages} key={messages.length}>
				{messages.length === 0 ? (
					<div className={styles.main__empty}>Нет сообщений. Начните диалог!</div>
				) : (
					messages.map((message) => (
						<div
							key={message.id}
							className={`${styles.message} ${message.sender === 'user' ? styles.messageUser : styles.messageOther}`}
						>
							<div className={styles.message__text}>{message.text}</div>
							<div className={styles.message__time}>
								{message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>
		</main>
	);
};
