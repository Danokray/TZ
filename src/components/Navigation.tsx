'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from './Navigation.module.scss';

const navigationItems = [
  { id: 'dashboard', label: 'Дашборд', icon: '/images/icons/dashbo.png', path: '/dashboard' },
  { id: 'profile', label: 'Профиль', icon: '/images/icons/profile.png', path: '/profile' },
  { id: 'orders', label: 'Заказы', icon: '/images/icons/ord.png', path: '/orders' },
  { id: 'payments', label: 'Платежи', icon: '/images/icons/pay.png', path: '/payments' },
  { id: 'stream', label: 'Трансляция', icon: '/images/icons/video.png', path: '/stream' },
];

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Определяем порядок кнопок в зависимости от активной страницы
  const getOrderedItems = () => {
    if (pathname === '/profile') {
      // Если активна страница профиля, ставим профиль первым
      return [
        navigationItems.find(item => item.id === 'profile'),
        navigationItems.find(item => item.id === 'dashboard'),
        ...navigationItems.filter(item => item.id !== 'profile' && item.id !== 'dashboard')
      ].filter((item): item is NonNullable<typeof item> => Boolean(item));
    }
    if (pathname === '/payments') {
      // Если активна страница платежей, ставим платежи первым
      return [
        navigationItems.find(item => item.id === 'payments'),
        navigationItems.find(item => item.id === 'orders'),
        navigationItems.find(item => item.id === 'profile'),
        navigationItems.find(item => item.id === 'dashboard'),
        navigationItems.find(item => item.id === 'stream')
      ].filter((item): item is NonNullable<typeof item> => Boolean(item));
    }
    return navigationItems;
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.menu}>
        {getOrderedItems().map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <img src={item.icon} alt={item.label} className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
