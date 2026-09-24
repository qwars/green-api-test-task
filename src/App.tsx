import { ErrorBoundary, Footer, Header, Main, Toast } from './components';
import { AuthScreen } from './components/auth-screen';
import { useAuth } from '@hooks/useAuth';
import { useMessages } from '@hooks/useMessages';
import { useToast } from '@hooks/useToast';

function App() {
	const { authData, isLoading, login, logout } = useAuth();
	const { toasts, show, hide } = useToast();

	const {
		messages,
		isLoading: isSending,
		send,
	} = useMessages({
		apiUrl: authData?.apiUrl || '',
		idInstance: authData?.idInstance || '',
		apiTokenInstance: authData?.apiTokenInstance || '',
		chatId: authData?.chatId || '',
		onError: (message) => show(message, 'error'),
	});

	if (isLoading) {
		return <div className='loading-screen'>Загрузка...</div>;
	}

	if (!authData) {
		return <AuthScreen login={login} />;
	}

	return (
		<ErrorBoundary>
			<Header chatId={authData.chatId} onLogout={logout} />
			<Main messages={messages} />
			<Footer onSend={send} isLoading={isSending} />
			<div className='toast-container'>
				{toasts.map((toast) => (
					<Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => hide(toast.id)} />
				))}
			</div>
		</ErrorBoundary>
	);
}

export default App;
