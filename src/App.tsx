import { useMessages } from '@hooks/useMessages';
import { useToast } from '@hooks/useToast';
import { validateEnv } from '@utils/validate-env';
import { useEffect, useState } from 'react';
import { ErrorBoundary, Footer, Header, Main, Toast } from './components';

function App() {
	const [envErrors, setEnvErrors] = useState<string[]>([]);
	const { toasts, show, hide } = useToast();
	const { messages, isLoading, send } = useMessages({
		onError: (message) => show(message, 'error'),
	});

	useEffect(() => {
		const { isValid, errors } = validateEnv();
		if (!isValid) {
			setEnvErrors(errors);
			errors.forEach((err) => show(err, 'error'));
		}
	}, [show]);

	if (envErrors.length > 0) {
		return (
			<div className='env-error'>
				<h2>Ошибка конфигурации</h2>
				<p>Заполните файл .env следующими переменными:</p>
				<ul>
					{envErrors.map((err) => (
						<li key={err}>{err}</li>
					))}
				</ul>
				<p>
					Смотрите <code>.env.example</code> для справки.
				</p>
			</div>
		);
	}

	return (
		<ErrorBoundary>
			<Header />
			<Main messages={messages} />
			<Footer onSend={send} isLoading={isLoading} />
			<div className='toast-container'>
				{toasts.map((toast) => (
					<Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => hide(toast.id)} />
				))}
			</div>
		</ErrorBoundary>
	);
}

export default App;
