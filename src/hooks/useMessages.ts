import { deleteNotification, receiveNotification, sendMessage } from '@utils/green-api';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Message } from '../types/green-api';

const CHAT_ID = import.meta.env.VITE_GREEN_API_CHAT_ID as string;
const POLLING_INTERVAL = 3000;

interface UseMessagesOptions {
	onError?: (message: string) => void;
}

export function useMessages(options: UseMessagesOptions = {}) {
	const { onError } = options;
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const pollingIntervalRef = useRef<number | null>(null);
	const lastErrorRef = useRef<string | null>(null);

	const send = useCallback(
		async (text: string) => {
			setIsLoading(true);
			try {
				await sendMessage(CHAT_ID, text);

				const newMessage: Message = {
					id: `outgoing-${Date.now()}`,
					text,
					sender: 'user',
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, newMessage]);
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
				onError?.(`Ошибка отправки: ${errorMessage}`);
			} finally {
				setIsLoading(false);
			}
		},
		[onError],
	);

	const pollNotifications = useCallback(async () => {
		try {
			const notification = await receiveNotification();

			if (notification && notification.body.typeWebhook === 'incomingMessageReceived') {
				const { messageData } = notification.body;

				if (messageData.typeMessage === 'textMessage' && messageData.textMessageData?.textMessage) {
					const incomingMessage: Message = {
						id: `incoming-${notification.receiptId}`,
						text: messageData.textMessageData.textMessage,
						sender: 'other',
						timestamp: new Date(messageData.timestamp * 1000),
					};

					setMessages((prev) => [...prev, incomingMessage]);
				}

				await deleteNotification(notification.receiptId);
			}

			// Сбрасываем ошибку при успешном запросе
			if (lastErrorRef.current) {
				lastErrorRef.current = null;
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Ошибка сети';

			// Показываем ошибку только один раз, чтобы не спамить пользователя
			if (lastErrorRef.current !== errorMessage) {
				lastErrorRef.current = errorMessage;
				onError?.(`Ошибка получения сообщений: ${errorMessage}`);
			}
		}
	}, [onError]);

	useEffect(() => {
		pollingIntervalRef.current = window.setInterval(pollNotifications, POLLING_INTERVAL);

		return () => {
			if (pollingIntervalRef.current) {
				window.clearInterval(pollingIntervalRef.current);
			}
		};
	}, [pollNotifications]);

	return {
		messages,
		isLoading,
		send,
	};
}
