import { useCallback, useEffect, useState } from 'react';
import type { AuthData } from '../types/auth';

const STORAGE_KEY = 'green-api-auth-data';

export function useAuth() {
	const [authData, setAuthData] = useState<AuthData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				setAuthData(JSON.parse(saved));
			}
		} catch (error) {
			console.error('Failed to parse auth data from localStorage', error);
			localStorage.removeItem(STORAGE_KEY);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const login = useCallback((data: Omit<AuthData, 'chatId'>) => {
		const chatId = `10000000`;

		const finalApiUrl = data.apiUrl;

		const newAuthData: AuthData = {
			...data,
			apiUrl: finalApiUrl,
			chatId,
		};

		setAuthData(newAuthData);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuthData));
	}, []);

	const logout = useCallback(() => {
		setAuthData(null);
		localStorage.removeItem(STORAGE_KEY);
	}, []);

	return { authData, isLoading, login, logout };
}
