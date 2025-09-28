'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import OrdersSection from '@/components/OrdersSection';
import styles from './page.module.scss';

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const mockUser = {
    id: 1,
    login: 'alim',
    email: 'alim@example.com',
    firstName: 'Алим',
    lastName: 'Джолдаспаев',
    phone: '+7 (123) 456-78-90',
    address: 'Алматы, Казахстан'
  };

  useEffect(() => {
    setUser(mockUser);
    setLoading(false);

    const checkAuth = async () => {
      try {
        const cachedUser = localStorage.getItem('user');
        const cacheTime = localStorage.getItem('userCacheTime');
        const now = Date.now();

        if (cachedUser && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
          setUser(JSON.parse(cachedUser));
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/user/profile', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300',
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userCacheTime', now.toString());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    setTimeout(checkAuth, 100);
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.ordersPage}>
      <Navigation />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Заказы</h1>
        <OrdersSection />
      </div>
    </div>
  );
}
