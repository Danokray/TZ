'use client';

import { useState } from 'react';
import styles from './DashboardOrders.module.scss';

interface Order {
  id: number;
  status: string;
  serviceDetails: string;
  orderDate: string;
  image: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    status: 'Готов',
    serviceDetails: 'Счета на оплату для Юр. Лиц',
    orderDate: '15.12.2024',
    image: '/images/order1.png'
  },
  {
    id: 2,
    status: 'Готов',
    serviceDetails: 'Гарантия на детали для переднего бампера',
    orderDate: '14.12.2024',
    image: '/images/order2.png'
  },
  {
    id: 3,
    status: 'Готов',
    serviceDetails: 'Чеки для Физ.лиц',
    orderDate: '13.12.2024',
    image: '/images/order3.png'
  },
  {
    id: 4,
    status: 'Готов',
    serviceDetails: 'Счета на оплату для Юр. Лиц',
    orderDate: '12.12.2024',
    image: '/images/order4.png'
  }
];

export default function DashboardOrders() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Готов':
        return '#10B981';
      case 'В процессе':
        return '#F59E0B';
      case 'Отменен':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const totalSlides = 7;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.dashboardOrders}>
      <div className={styles.header}>
        <div className={styles.blueBar}></div>
        <h2>Заказы</h2>
      </div>

      {/* 4 карточки документов в ряд */}
      <div className={styles.ordersGrid}>
        {mockOrders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.documentImage}>
              <img src={order.image} alt={order.serviceDetails} />
            </div>
            
            <div className={styles.orderContent}>
              <h3 className={styles.serviceDetails}>{order.serviceDetails}</h3>
              
              <button className={styles.downloadBtn}>
                <img src="/images/icons/Mask group.png" alt="Скачать" className={styles.downloadIcon} />
                Скачать
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Карусель с точками навигации */}
      <div className={styles.carousel}>
        <div 
          className={styles.slidesContainer}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: 7 }).map((_, slideIndex) => (
            <div key={slideIndex} className={styles.slide}>
              <div className={styles.ordersGrid}>
                {mockOrders.map((order) => (
                  <div key={`${slideIndex}-${order.id}`} className={styles.orderCard}>
                    <div className={styles.documentImage}>
                      <img src={order.image} alt={order.serviceDetails} />
                    </div>
                    
                    <div className={styles.orderContent}>
                      <h3 className={styles.serviceDetails}>{order.serviceDetails}</h3>
                      
                      <button className={styles.downloadBtn}>
                        <img src="/images/icons/Mask group.png" alt="Скачать" className={styles.downloadIcon} />
                        Скачать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.dots}>
          {Array.from({ length: 7 }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к заказу ${index + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
