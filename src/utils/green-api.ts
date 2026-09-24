import type { NotificationResponse, SendMessageResponse } from '../types/green-api';

const ID_INSTANCE = import.meta.env.VITE_GREEN_API_ID_INSTANCE as string;
const API_TOKEN = import.meta.env.VITE_GREEN_API_API_TOKEN as string;
const BASE_URL = `https://api.green-api.com/waInstance${ID_INSTANCE}`;

// Отправка сообщения
export async function sendMessage(chatId: string, message: string): Promise<SendMessageResponse> {
	const url = `${BASE_URL}/sendMessage/${API_TOKEN}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chatId,
			message,
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to send message: ${response.statusText}`);
	}

	return response.json();
}

// Получение уведомления (polling)
export async function receiveNotification(): Promise<NotificationResponse | null> {
	const url = `${BASE_URL}/receiveNotification/${API_TOKEN}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to receive notification: ${response.statusText}`);
	}

	const data = await response.json();

	// Если нет уведомлений, GREEN-API возвращает {"receiptId": 0, "body": null}
	if (!data.body || data.receiptId === 0) {
		return null;
	}

	return data;
}

// Удаление уведомления (подтверждение получения)
export async function deleteNotification(receiptId: number): Promise<void> {
	const url = `${BASE_URL}/deleteNotification/${API_TOKEN}/${receiptId}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to delete notification: ${response.statusText}`);
	}
}
