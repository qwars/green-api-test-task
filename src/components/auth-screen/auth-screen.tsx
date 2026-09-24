import { useState, type FormEvent } from 'react';
import { useAuth } from '@hooks/useAuth';
import styles from './auth-screen.module.scss';

export const AuthScreen = () => {
	const { login } = useAuth();
	const [idInstance, setIdInstance] = useState('');
	const [apiTokenInstance, setApiTokenInstance] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [messenger, setMessenger] = useState<'whatsapp' | 'max'>('whatsapp');
	const [error, setError] = useState('');

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError('');

		if (!idInstance.trim() || !apiTokenInstance.trim() || !phoneNumber.trim()) {
			setError('Пожалуйста, заполните все поля');
			return;
		}

		login({
			idInstance: idInstance.trim(),
			apiTokenInstance: apiTokenInstance.trim(),
			phoneNumber: phoneNumber.trim(),
			messenger,
		});
	};

	return (
		<div className={styles.authScreen}>
			<div className={styles.authCard}>
				<h1 className={styles.title}>Вход в Green-API Chat</h1>
				<p className={styles.subtitle}>Введите данные из личного кабинета GREEN-API</p>

				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.field}>
						<label htmlFor='idInstance'>ID Instance</label>
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
						<label htmlFor='apiTokenInstance'>API Token Instance</label>
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
						<label htmlFor='phoneNumber'>Номер телефона получателя</label>
						<input
							id='phoneNumber'
							type='tel'
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder='79991234567'
						/>
						<span className={styles.hint}>
							Будет преобразован в формат: {phoneNumber.replace(/\D/g, '') || 'номер'}
							{messenger === 'max' ? '@max.ru' : '@c.us'}
						</span>
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
