// Тип сообщения в UI
export interface Message {
	id: string;
	text: string;
	sender: 'user' | 'other';
	timestamp: Date;
}

// Ответ от receiveNotification
export interface NotificationResponse {
	receiptId: number;
	body: {
		typeWebhook: string;
		instanceData: {
			idInstance: number;
			wid: string;
			type: string;
		};
		senderData: {
			chatId: string;
			sender: string;
			senderName: string;
			senderContactName: string;
		};
		messageData: {
			typeMessage: string;
			textMessageData?: {
				textMessage: string;
			};
			timestamp: number;
		};
	};
}

// Ответ от sendMessage
export interface SendMessageResponse {
	idMessage: string;
}
