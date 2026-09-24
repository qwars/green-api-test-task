import styles from './header.module.scss';

interface HeaderProps {
	chatId: string;
	onLogout: () => void;
}

export const Header = ({ chatId, onLogout }: HeaderProps) => {
	return (
		<header className={styles.header}>
			<div className={styles.header__content}>
				<div className={styles.header__info}>
					<h1 className={styles.header__title}>Чат</h1>
					<span className={styles.header__subtitle}>{chatId}</span>
				</div>
				<button type='button' className={styles.header__logout} onClick={onLogout}>
					Выйти
				</button>
			</div>
		</header>
	);
};
