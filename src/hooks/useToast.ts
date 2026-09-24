import type { ToastType } from '@components/toast/toast';
import { useCallback, useState } from 'react';

interface ToastItem {
	id: string;
	message: string;
	type: ToastType;
}

export function useToast() {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const show = useCallback((message: string, type: ToastType = 'info') => {
		const id = `toast-${Date.now()}-${Math.random()}`;
		setToasts((prev) => [...prev, { id, message, type }]);
	}, []);

	const hide = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return { toasts, show, hide };
}
