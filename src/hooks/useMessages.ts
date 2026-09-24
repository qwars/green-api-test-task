import { deleteNotification, receiveNotification, sendMessage } from '@utils/green-api';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Message } from '../types/green-api';

const POLLING_INTERVAL = 3000;

interface UseMessagesOptions {
	apiUrl: string;
	idInstance: string;
	apiTokenInstance: string;
	chatId: string;
	onError?: (message: string) => void;
}

export function useMessages({ apiUrl, idInstance, apiTokenInstance, chatId, onError }: UseMessagesOptions) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const pollingIntervalRef = useRef<number | null>(null);
	const lastErrorRef = useRef<string | null>(null);

	const send = useCallback(
		async (text: string) => {
			setIsLoading(true);
			try {
				await sendMessage(apiUrl, idInstance, apiTokenInstance, chatId, text);

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
		[apiUrl, idInstance, apiTokenInstance, chatId, onError],
	);

	const pollNotifications = useCallback(async () => {
		try {
			const notification = await receiveNotification(apiUrl, idInstance, apiTokenInstance);

			if (notification && notification.body.typeWebhook === 'incomingMessageReceived') {
				const { messageData, senderData } = notification.body;

				if (
					senderData.chatId === chatId &&
					messageData.typeMessage === 'textMessage' &&
					messageData.textMessageData?.textMessage
				) {
					const incomingMessage: Message = {
						id: `incoming-${notification.receiptId}`,
						text: messageData.textMessageData.textMessage,
						sender: 'other',
						timestamp: new Date(messageData.timestamp * 1000),
					};

					setMessages((prev) => [...prev, incomingMessage]);
				}

				await deleteNotification(apiUrl, idInstance, apiTokenInstance, notification.receiptId);
			}

			if (lastErrorRef.current) {
				lastErrorRef.current = null;
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Ошибка сети';
			if (lastErrorRef.current !== errorMessage) {
				lastErrorRef.current = errorMessage;
				onError?.(`Ошибка получения: ${errorMessage}`);
			}
		}
	}, [apiUrl, idInstance, apiTokenInstance, chatId, onError]);

	useEffect(() => {
		pollingIntervalRef.current = window.setInterval(pollNotifications, POLLING_INTERVAL);
		return () => {
			if (pollingIntervalRef.current) {
				window.clearInterval(pollingIntervalRef.current);
			}
		};
	}, [pollNotifications]);

	return { messages, isLoading, send };
}
