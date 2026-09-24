import { useState, type FormEvent } from 'react';
import type { AuthData } from '../../types/auth';
import styles from './auth-screen.module.scss';

interface AuthScreenProps {
	login: (data: Omit<AuthData, 'chatId'>) => void;
}

export const AuthScreen = ({ login }: AuthScreenProps) => {
	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');
	const [apiUrl, setApiUrl] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [messenger, setMessenger] = useState<'whatsapp' | 'max'>('max');
	const [error, setError] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError('');

		if (!idInstance.trim() || !apiTokenInstance.trim() || !phoneNumber.trim()) {
			setError('Пожалуйста, заполните все обязательные поля');
			return;
		}

		login({
			idInstance: idInstance.trim(),
			apiTokenInstance: apiTokenInstance.trim(),
			apiUrl: apiUrl.trim() || '',
			phoneNumber: phoneNumber.trim(),
			messenger,
		});
	};

	return (
		<div className={styles.authScreen}>
			<div className={styles.authCard}>
				<h1 className={styles.title}>Вход в Green-API Chat</h1>
				<p className={styles.subtitle}>Введите данные из личного кабинета</p>

				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.field}>
						<label htmlFor='apiUrl'>API URL</label>
						<input
							id='apiUrl'
							type='text'
							value={apiUrl}
							onChange={(e) => setApiUrl(e.target.value)}
							placeholder='https://api.green-api.com'
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor='idInstance'>ID Instance *</label>
						<input
							id='idInstance'
							type='text'
							value={idInstance}
							onChange={(e) => setIdInstance(e.target.value)}
							placeholder='1101000000'
							autoComplete='off'
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor='apiTokenInstance'>API Token Instance *</label>
						<input
							id='apiTokenInstance'
							type='password'
							value={apiTokenInstance}
							onChange={(e) => setApiTokenInstance(e.target.value)}
							placeholder='your_api_token_here'
							autoComplete='off'
						/>
					</div>

					<div className={styles.field}>
						<label htmlFor='messenger'>Мессенджер получателя</label>
						<select
							id='messenger'
							value={messenger}
							onChange={(e) => setMessenger(e.target.value as 'whatsapp' | 'max')}
						>
							<option value='whatsapp'>WhatsApp</option>
							<option value='max'>MAX</option>
						</select>
					</div>

					<div className={styles.field}>
						<label htmlFor='phoneNumber'>Номер телефона получателя *</label>
						<input
							id='phoneNumber'
							type='tel'
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder='79991234567'
						/>
					</div>

					{error && <div className={styles.error}>{error}</div>}

					<button type='submit' className={styles.submitButton}>
						Начать чат
					</button>
				</form>
			</div>
		</div>
	);
};
