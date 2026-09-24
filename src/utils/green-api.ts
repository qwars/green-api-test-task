import type { NotificationResponse, SendMessageResponse } from '../types/green-api';

export async function sendMessage(
	apiUrl: string,
	idInstance: string,
	apiTokenInstance: string,
	chatId: string,
	message: string,
): Promise<SendMessageResponse> {
	const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

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
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Ошибка отправки: ${response.statusText}`);
	}

	return response.json();
}

export async function receiveNotification(
	apiUrl: string,
	idInstance: string,
	apiTokenInstance: string,
): Promise<NotificationResponse | null> {
	const url = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка получения уведомлений: ${response.statusText}`);
	}

	const data = await response.json();

	if (!data || data.receiptId === 0 || !data.body) {
		return null;
	}

	return data;
}

export async function deleteNotification(
	apiUrl: string,
	idInstance: string,
	apiTokenInstance: string,
	receiptId: number,
): Promise<void> {
	const url = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Ошибка удаления уведомления: ${response.statusText}`);
	}
}
