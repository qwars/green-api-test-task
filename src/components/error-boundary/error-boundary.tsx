import type { ReactNode } from 'react';
import { Component } from 'react';
import './error-boundary.scss';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className='error-boundary'>
					<h2>Что-то пошло не так</h2>
					<p>{this.state.error?.message}</p>
					<button type='button' onClick={() => this.setState({ hasError: false, error: null })}>
						Попробовать снова
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
