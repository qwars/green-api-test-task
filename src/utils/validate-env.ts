export function validateEnv(): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!import.meta.env.VITE_GREEN_API_ID_INSTANCE) {
		errors.push('VITE_GREEN_API_ID_INSTANCE не задан');
	}

	if (!import.meta.env.VITE_GREEN_API_API_TOKEN) {
		errors.push('VITE_GREEN_API_API_TOKEN не задан');
	}

	if (!import.meta.env.VITE_GREEN_API_CHAT_ID) {
		errors.push('VITE_GREEN_API_CHAT_ID не задан');
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
