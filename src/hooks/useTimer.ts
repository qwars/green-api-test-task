import { useEffect, useState } from 'react';

export const useTimer = (endTime: number) => {
	const [timeLeft, setTimeLeft] = useState(endTime);

	useEffect(() => {
		const timer = setInterval(() => {
			const remaining = endTime - Date.now();
			setTimeLeft(remaining);
		}, 1000);

		return () => clearInterval(timer);
	}, [endTime]);

	return formatTime(timeLeft);
};

const formatTime = (milliseconds: number): string => {
	if (milliseconds <= 0) return '00h 00m 00s';
	return new Date(milliseconds)
		.toLocaleString('en-EN', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
		.replace(/(\d+):(\d+):(\d+).+/g, '$1h $2m $3s');
};
