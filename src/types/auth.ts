export interface AuthData {
	idInstance: string;
	apiTokenInstance: string;
	phoneNumber: string;
	messenger: 'whatsapp' | 'max';
	chatId: string;
}
