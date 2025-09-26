'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import styles from './page.module.scss';

// Ленивая загрузка тяжелых компонентов
const OrdersSection = lazy(() => import('@/components/OrdersSection'));
const ProfileSection = lazy(() => import('@/components/ProfileSection'));
const StreamSection = lazy(() => import('@/components/StreamSection'));
const PaymentsSection = lazy(() => import('@/components/PaymentsSection'));

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию пользователя
    const checkAuth = async () => {
      try {
        // Добавляем таймаут для API запроса
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

        const response = await fetch('/api/user/profile', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Если пользователь не авторизован, перенаправляем на страницу входа
          router.push('/auth');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Request timeout');
        }
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
    return null; // Редирект уже произошел
  }

  return (
    <div className={styles.dashboard}>
      <Navigation />
      <div className={styles.content}>
        <div className={styles.welcome}>
          <h1>Привет, Алим{'\n'}Джолдаспаев 👋</h1>
        </div>
        
        {/* Первый ряд: Заказы (950px) + Профиль (450px) */}
        <div className={styles.firstRow}>
          <div className={styles.ordersContainer}>
            <Suspense fallback={<div className={styles.skeleton}>Загрузка заказов...</div>}>
              <OrdersSection />
            </Suspense>
          </div>
          <Suspense fallback={<div className={styles.skeleton}>Загрузка профиля...</div>}>
            <ProfileSection user={user} />
          </Suspense>
        </div>
        
        {/* Второй ряд: Трансляция (450px) + Платежи (950px) */}
        <div className={styles.secondRow}>
          <Suspense fallback={<div className={styles.skeleton}>Загрузка трансляции...</div>}>
            <StreamSection />
          </Suspense>
          <Suspense fallback={<div className={styles.skeleton}>Загрузка платежей...</div>}>
            <PaymentsSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}