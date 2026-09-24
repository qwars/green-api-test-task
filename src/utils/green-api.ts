import type { NotificationResponse, SendMessageResponse } from '../types/green-api';

export async function sendMessage(
	idInstance: string,
	apiTokenInstance: string,
	chatId: string,
	message: string,
): Promise<SendMessageResponse> {
	const url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chatId, message }),
	});

	if (!response.ok) {
		throw new Error(`Failed to send message: ${response.statusText}`);
	}

	return response.json();
}

export async function receiveNotification(
	idInstance: string,
	apiTokenInstance: string,
): Promise<NotificationResponse | null> {
	const url = `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to receive notification: ${response.statusText}`);
	}

	const data = await response.json();
	if (!data.body || data.receiptId === 0) {
		return null;
	}

	return data;
}

export async function deleteNotification(
	idInstance: string,
	apiTokenInstance: string,
	receiptId: number,
): Promise<void> {
	const url = `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to delete notification: ${response.statusText}`);
	}
}
