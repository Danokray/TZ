'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import styles from './page.module.scss';

export default function TestBitrixPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/bitrix/test-connection');
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Ошибка подключения');
      }
    } catch (err) {
      setError('Ошибка сети: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const testCreateContact = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/bitrix/test-connection', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Ошибка создания контакта');
      }
    } catch (err) {
      setError('Ошибка сети: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const debugConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/bitrix/debug-connection');
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Ошибка диагностики');
        setResult(data.details);
      }
    } catch (err) {
      setError('Ошибка сети: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const testContactCreation = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/bitrix/test-contact-creation', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Ошибка создания контакта');
        setResult(data.details);
      }
    } catch (err) {
      setError('Ошибка сети: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.testPage}>
      <Navigation />
      
      <main className={styles.main}>
        <h1 className={styles.title}>Тестирование интеграции с Битрикс24</h1>
        
        <div className={styles.instructions}>
          <h2>Инструкции по настройке:</h2>
          <ol>
            <li>Обновите файл <code>src/config/bitrix.ts</code> с вашим реальным вебхуком</li>
            <li>Или создайте переменную окружения <code>BITRIX_WEBHOOK_URL</code></li>
            <li>Нажмите кнопки ниже для тестирования</li>
          </ol>
        </div>

        <div className={styles.buttons}>
          <button 
            onClick={debugConnection}
            disabled={loading}
            className={styles.testButton}
          >
            {loading ? 'Диагностируем...' : '🔍 Детальная диагностика'}
          </button>
          
          <button 
            onClick={testConnection}
            disabled={loading}
            className={styles.testButton}
          >
            {loading ? 'Тестируем...' : 'Тест подключения'}
          </button>
          
          <button 
            onClick={testCreateContact}
            disabled={loading}
            className={styles.testButton}
          >
            {loading ? 'Создаем...' : 'Тест создания контакта'}
          </button>
          
          <button 
            onClick={testContactCreation}
            disabled={loading}
            className={styles.testButton}
          >
            {loading ? 'Диагностируем...' : '🔍 Диагностика создания контакта'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <h3>❌ Ошибка:</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className={styles.result}>
            <h3>✅ Результат:</h3>
            <pre className={styles.codeBlock}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
