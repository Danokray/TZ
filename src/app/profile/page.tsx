'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { ProfileLarge } from '@/components/ProfileLarge';
import styles from './page.module.scss';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Моковые данные для мгновенной загрузки
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
    // Сначала показываем моковые данные для мгновенной загрузки
    setUser(mockUser);
    setLoading(false);

    // Затем в фоне загружаем реальные данные
    const checkAuth = async () => {
      try {
        // Проверяем кэш в localStorage
        const cachedUser = localStorage.getItem('user');
        const cacheTime = localStorage.getItem('userCacheTime');
        const now = Date.now();
        
        // Если есть кэш и он не старше 5 минут, используем его
        if (cachedUser && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
          setUser(JSON.parse(cachedUser));
          return;
        }

        // Добавляем таймаут для API запроса
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 секунды таймаут

        const response = await fetch('/api/user/profile', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 минут кэш
          }
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Сохраняем в localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userCacheTime', now.toString());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // В случае ошибки оставляем моковые данные
      }
    };

    // Запускаем проверку в фоне
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
    return null; // Редирект уже произошел
  }

  return (
    <div className={styles.profilePage}>
      <Navigation />
      
      <div className={styles.content}>
        <ProfileLarge />
      </div>
    </div>
  );
}
