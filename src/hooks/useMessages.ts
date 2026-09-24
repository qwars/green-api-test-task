import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '../types/green-api';
import { sendMessage, receiveNotification, deleteNotification } from '@utils/green-api';

const POLLING_INTERVAL = 3000;

interface UseMessagesOptions {
	idInstance: string;
	apiTokenInstance: string;
	chatId: string;
	onError?: (message: string) => void;
}

export function useMessages({ idInstance, apiTokenInstance, chatId, onError }: UseMessagesOptions) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const pollingIntervalRef = useRef<number | null>(null);
	const lastErrorRef = useRef<string | null>(null);

	const send = useCallback(
		async (text: string) => {
			setIsLoading(true);
			try {
				await sendMessage(idInstance, apiTokenInstance, chatId, text);

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
		[idInstance, apiTokenInstance, chatId, onError],
	);

	const pollNotifications = useCallback(async () => {
		try {
			const notification = await receiveNotification(idInstance, apiTokenInstance);

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

				await deleteNotification(idInstance, apiTokenInstance, notification.receiptId);
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
	}, [idInstance, apiTokenInstance, chatId, onError]);

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
