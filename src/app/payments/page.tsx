'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { Payment, User } from '@/types';

export default function PaymentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  const [newPayment, setNewPayment] = useState({
    amount: '',
    currency: 'RUB',
    description: '',
    status: 'pending' as const
  });

  useEffect(() => {
    // Проверяем авторизацию
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth');
      return;
    }

    setUser(JSON.parse(userData));
    loadPayments();
  }, [router]);

  const loadPayments = async () => {
    try {
      // В реальном проекте здесь был бы API для получения платежей пользователя
      // Пока используем моковые данные
      const mockPayments: Payment[] = [
        {
          id: 1,
          userId: 1,
          amount: 1500,
          currency: 'RUB',
          description: 'Оплата за услуги',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          userId: 1,
          amount: 2500,
          currency: 'RUB',
          description: 'Подписка на месяц',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      // В реальном проекте здесь был бы API для создания платежа
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
        userId: user.id
      };

      // Добавляем новый платеж в список (в реальном проекте это делал бы API)
      const newPaymentObj: Payment = {
        id: Date.now(),
        ...paymentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setPayments([newPaymentObj, ...payments]);
      setNewPayment({ amount: '', currency: 'RUB', description: '', status: 'pending' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      case 'cancelled': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'completed': return 'Завершен';
      case 'pending': return 'Ожидает';
      case 'failed': return 'Ошибка';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.paymentsPage}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentsPage}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <button 
                onClick={() => router.push('/dashboard')}
                className={styles.backButton}
              >
                ← Назад
              </button>
              <h1>Платежи</h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn btn--primary"
            >
              Создать платеж
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          {/* Форма создания платежа */}
          {showCreateForm && (
            <div className={styles.createForm}>
              <div className={styles.formHeader}>
                <h2>Создать новый платеж</h2>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreatePayment} className={styles.form}>
                <div className="form-group">
                  <label htmlFor="amount">Сумма</label>
                  <input
                    type="number"
                    id="amount"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    required
                    placeholder="Введите сумму"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Валюта</label>
                  <select
                    id="currency"
                    value={newPayment.currency}
                    onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })}
                  >
                    <option value="RUB">RUB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Описание</label>
                  <textarea
                    id="description"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                    required
                    placeholder="Введите описание платежа"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Статус</label>
                  <select
                    id="status"
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value as Payment['status'] })}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="completed">Завершен</option>
                    <option value="failed">Ошибка</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn--secondary"
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit"
                    className="btn btn--primary"
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Список платежей */}
          <div className={styles.paymentsList}>
            <h2>Список платежей</h2>
            
            {payments.length > 0 ? (
              <div className={styles.paymentsGrid}>
                {payments.map((payment) => (
                  <div key={payment.id} className={styles.paymentCard}>
                    <div className={styles.paymentHeader}>
                      <h3>{payment.description}</h3>
                      <span 
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(payment.status) }}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                    
                    <div className={styles.paymentDetails}>
                      <div className={styles.amount}>
                        <span className={styles.amountValue}>
                          {payment.amount} {payment.currency}
                        </span>
                      </div>
                      
                      <div className={styles.date}>
                        <span>Создан:</span>
                        <span>{new Date(payment.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                      
                      <div className={styles.date}>
                        <span>Обновлен:</span>
                        <span>{new Date(payment.updatedAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noPayments}>
                <p>Платежей пока нет</p>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn--primary"
                >
                  Создать первый платеж
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
