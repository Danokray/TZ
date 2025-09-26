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

  return (
    <nav className={styles.navigation}>
      <div className={styles.menu}>
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''} ${item.id === 'dashboard' ? styles.dashboardBtn : ''}`}
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
