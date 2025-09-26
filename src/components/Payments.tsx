import { useState } from 'react';
import styles from './Payments.module.scss';

interface Payment {
  id: number;
  name: string;
  email: string;
  status: 'paid' | 'unpaid';
  progress: number;
}

interface PaymentsProps {
  onViewPayment: (paymentId: number) => void;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    name: 'Имя',
    email: 'Почта@jourrapide.com',
    status: 'unpaid',
    progress: 96
  },
  {
    id: 2,
    name: 'Имя',
    email: 'Почта@jourrapide.com',
    status: 'paid',
    progress: 73
  },
  {
    id: 3,
    name: 'Имя',
    email: 'Почта@jourrapide.com',
    status: 'paid',
    progress: 73
  },
  {
    id: 4,
    name: 'Имя',
    email: 'Почта@jourrapide.com',
    status: 'unpaid',
    progress: 85
  }
];

export function Payments({ onViewPayment }: PaymentsProps) {
  const [filter, setFilter] = useState('week');

  const handleViewPayment = (paymentId: number) => {
    onViewPayment(paymentId);
  };

  const getStatusText = (status: 'paid' | 'unpaid') => {
    return status === 'paid' ? 'Оплачено' : 'Не оплачено';
  };

  const getStatusClass = (status: 'paid' | 'unpaid') => {
    return status === 'paid' ? styles.statusPaid : styles.statusUnpaid;
  };

  return (
    <div className={styles.paymentsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Платежи</div>
        <select 
          className={styles.paymentsFilter}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="week">Все платежи за последнюю неделю</option>
          <option value="month">Все платежи за последний месяц</option>
          <option value="year">Все платежи за последний год</option>
        </select>
      </div>
      
      <div className={styles.paymentsTable}>
        <div className={styles.tableHeader}>
          <div className={styles.employeeColumn}>
            Employee ↑
          </div>
          <div className={styles.statusColumn}>Статус</div>
          <div className={styles.progressColumn}>Выполнено</div>
          <div className={styles.actionColumn}>Действие</div>
        </div>
        
        {mockPayments.map(payment => (
          <div key={payment.id} className={styles.tableRow}>
            <div className={styles.employeeInfo}>
              <div className={styles.employeeAvatar}>
                <img 
                  src="/images/icons/person.png" 
                  alt="Profile" 
                  className={styles.avatarImage}
                />
              </div>
              <div className={styles.employeeDetails}>
                <div className={styles.employeeName}>{payment.name}</div>
                <div className={styles.employeeEmail}>{payment.email}</div>
              </div>
            </div>
            
            <div className={styles.status}>
              <div className={`${styles.statusDot} ${payment.status === 'paid' ? styles.statusPaid : styles.statusUnpaid}`}></div>
              <span className={`${styles.statusText} ${getStatusClass(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
            </div>
            
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${payment.progress}%` }}
                ></div>
              </div>
              <span className={styles.progressText}>{payment.progress}%</span>
            </div>
            
            <div className={styles.action}>
              <span 
                className={styles.viewText}
                onClick={() => handleViewPayment(payment.id)}
              >
                Смотреть
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
