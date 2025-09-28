'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import styles from './page.module.scss';
import { Payment, User } from '@/types';

export default function PaymentsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const router = useRouter();

  const [newPayment, setNewPayment] = useState({
    amount: '',
    currency: 'RUB',
    description: '',
    status: 'pending' as 'pending' | 'completed' | 'failed' | 'cancelled'
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
      // Загружаем данные из Битрикс24
      const response = await fetch('/api/bitrix/deals');
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.data);
      } else {
        console.error('Failed to load payments:', data.error);
        // В случае ошибки показываем моковые данные
        loadMockPayments();
      }
    } catch (error) {
      console.error('Error loading payments:', error);
      // В случае ошибки показываем моковые данные
      loadMockPayments();
    } finally {
      setLoading(false);
    }
  };

  const loadMockPayments = () => {
    // Моковые данные для таблицы платежей (fallback)
    const mockPayments: Payment[] = [
        {
          id: 1,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'pending',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 2,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 3,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 4,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 5,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 6,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 7,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        },
        {
          id: 8,
          userId: 1,
          amount: 15000,
          currency: 'KZT',
          description: '321312321',
          status: 'completed',
          createdAt: new Date('2025-03-16').toISOString(),
          updatedAt: new Date('2025-03-16').toISOString()
        }
    ];
    
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  };

  // Фильтрация платежей
  useEffect(() => {
    let filtered = payments;

    // Фильтр по статусу
    if (filters.status) {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    // Фильтр по поиску (номер счета, сумма)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.description.toLowerCase().includes(searchLower) ||
        payment.amount.toString().includes(searchLower)
      );
    }

    setFilteredPayments(filtered);
  }, [payments, filters]);

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
      case 'completed': return 'Оплачено';
      case 'pending': return 'Не оплачено';
      case 'failed': return 'Ошибка';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const handlePay = async (payment: Payment) => {
    try {
      console.log('💳 Обрабатываем платеж:', payment);
      
      // Если это моковые данные (нет bitrixDealId), просто обновляем локально
      if (!payment.bitrixDealId) {
        console.log('📝 Обновляем моковый платеж локально');
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.id === payment.id 
              ? { ...p, status: 'completed' as const }
              : p
          )
        );
        alert('Платеж успешно обработан! (моковые данные)');
        return;
      }

      // Обновляем стадию сделки в Битрикс24
      console.log('🔄 Отправляем запрос в Битрикс24:', {
        dealId: payment.bitrixDealId,
        stageId: 'WON'
      });
      
      const response = await fetch('/api/bitrix/deals/update-stage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: payment.bitrixDealId,
          stageId: 'WON' // Переводим в стадию "Выиграна"
        }),
      });

      const data = await response.json();
      console.log('📡 Ответ от API:', data);

      if (data.success) {
        // Обновляем статус в локальном состоянии
        setPayments(prevPayments => 
          prevPayments.map(p => 
            p.id === payment.id 
              ? { ...p, status: 'completed' as const }
              : p
          )
        );
        alert('Платеж успешно обработан!');
      } else {
        console.error('❌ Ошибка API:', data.error);
        alert('Ошибка при обработке платежа: ' + data.error);
      }
    } catch (error) {
      console.error('❌ Ошибка обработки платежа:', error);
      alert('Ошибка при обработке платежа: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      <Navigation />

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Платежи</h1>
        
        {/* Фильтры */}
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Поиск по номеру счета или сумме..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className={styles.statusSelect}
            >
              <option value="">Все статусы</option>
              <option value="pending">Не оплачено</option>
              <option value="completed">Оплачено</option>
              <option value="failed">Ошибка</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
        </div>
        
        {/* Таблица платежей */}
        <div className={styles.paymentsTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Номер счета</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.description}</td>
                    <td>{new Date(payment.createdAt).toLocaleDateString('ru-RU')}</td>
                    <td>{payment.amount.toLocaleString('ru-RU')} {payment.currency}</td>
                    <td>
                      <span 
                        className={styles.status}
                        style={{ 
                          color: payment.status === 'completed' ? 'rgba(1, 71, 255, 0.4)' : '#1f2937',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td>
                      {payment.status === 'pending' ? (
                        <button 
                          className={styles.payButton}
                          onClick={() => handlePay(payment)}
                        >
                          Оплатить
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </main>
    </div>
  );
}
