'use client';

import styles from './OrdersSection.module.scss';

interface Order {
  id: number;
  status: string;
  serviceDetails: string;
  orderDate: string;
}

interface OrdersProps {
  onRepeatOrder: (orderId: number) => void;
}

const mockOrders: Order[] = [
  {
    id: 1,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '15.12.2024'
  },
  {
    id: 2,
    status: 'В процессе',
    serviceDetails: 'Детали услуги',
    orderDate: '14.12.2024'
  },
  {
    id: 3,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '13.12.2024'
  },
  {
    id: 4,
    status: 'Отменен',
    serviceDetails: 'Детали услуги',
    orderDate: '12.12.2024'
  },
  {
    id: 5,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '11.12.2024'
  },
  {
    id: 6,
    status: 'В процессе',
    serviceDetails: 'Детали услуги',
    orderDate: '10.12.2024'
  },
  {
    id: 7,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '09.12.2024'
  },
  {
    id: 8,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '08.12.2024'
  },
  {
    id: 9,
    status: 'В процессе',
    serviceDetails: 'Детали услуги',
    orderDate: '07.12.2024'
  },
  {
    id: 10,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '06.12.2024'
  },
  {
    id: 11,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '05.12.2024'
  },
  {
    id: 12,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '04.12.2024'
  },
  {
    id: 13,
    status: 'В процессе',
    serviceDetails: 'Детали услуги',
    orderDate: '03.12.2024'
  },
  {
    id: 14,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '02.12.2024'
  },
  {
    id: 15,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '01.12.2024'
  },
  {
    id: 16,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '30.11.2024'
  },
  {
    id: 17,
    status: 'В процессе',
    serviceDetails: 'Детали услуги',
    orderDate: '29.11.2024'
  },
  {
    id: 18,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '28.11.2024'
  },
  {
    id: 19,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '27.11.2024'
  },
  {
    id: 20,
    status: 'Выполнен',
    serviceDetails: 'Детали услуги',
    orderDate: '26.11.2024'
  }
];

export function Orders({ onRepeatOrder }: OrdersProps) {
  const getStatusColor = (status: string) => {
    return '#0147FF';
  };

  return (
    <div className={styles.ordersGrid}>
      {mockOrders.map(order => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <div className={styles.statusIndicator}>
              <div 
                className={styles.statusDot} 
                style={{ backgroundColor: getStatusColor(order.status) }}
              ></div>
              <span className={styles.statusText}>Статус</span>
            </div>
          </div>
          
          <div className={styles.orderContent}>
            <h3 className={styles.serviceDetails}>{order.serviceDetails}</h3>
            <p className={styles.orderDate}>Дата заказа</p>
          </div>
          
          <button 
            className={styles.repeatOrderBtn}
            onClick={() => onRepeatOrder(order.id)}
          >
            Повторить заказ
          </button>
        </div>
      ))}
    </div>
  );
}

export default function OrdersSection() {
  const handleRepeatOrder = (orderId: number) => {
    console.log(`Repeating order ${orderId}`);
    // Здесь будет логика повторения заказа
  };

  return <Orders onRepeatOrder={handleRepeatOrder} />;
}
