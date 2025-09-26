'use client';

import { useState } from 'react';
import styles from './OrdersSection.module.scss';

interface Order {
  id: number;
  title: string;
  image: string;
}

interface OrdersProps {
  onDownload: (orderId: number) => void;
}

const mockOrders: Order[] = [
  {
    id: 1,
    title: 'Счета на оплату для Юр. Лиц',
    image: '/images/order1.png'
  },
  {
    id: 2,
    title: 'Гарантия на детали для переднего бампера',
    image: '/images/order2.png'
  },
  {
    id: 3,
    title: 'Чеки для Физ.лиц',
    image: '/images/order3.png'
  },
  {
    id: 4,
    title: 'Счета на оплату для Юр. Лиц',
    image: '/images/order4.png'
  },
  {
    id: 5,
    title: 'Договор на поставку запчастей',
    image: '/images/order1.png'
  },
  {
    id: 6,
    title: 'Акт выполненных работ',
    image: '/images/order2.png'
  },
  {
    id: 7,
    title: 'Счет-фактура №12345',
    image: '/images/order3.png'
  },
  {
    id: 8,
    title: 'Накладная на товар',
    image: '/images/order4.png'
  },
  {
    id: 9,
    title: 'Справка о проведенном ремонте',
    image: '/images/order1.png'
  },
  {
    id: 10,
    title: 'Смета на запчасти',
    image: '/images/order2.png'
  },
  {
    id: 11,
    title: 'Протокол диагностики',
    image: '/images/order3.png'
  },
  {
    id: 12,
    title: 'Договор на техническое обслуживание',
    image: '/images/order4.png'
  },
  {
    id: 13,
    title: 'Акт приема-передачи автомобиля',
    image: '/images/order1.png'
  },
  {
    id: 14,
    title: 'Счет на оплату услуг',
    image: '/images/order2.png'
  },
  {
    id: 15,
    title: 'Гарантийный талон',
    image: '/images/order3.png'
  },
  {
    id: 16,
    title: 'Инструкция по эксплуатации',
    image: '/images/order4.png'
  },
  {
    id: 17,
    title: 'Сертификат качества',
    image: '/images/order1.png'
  },
  {
    id: 18,
    title: 'Декларация соответствия',
    image: '/images/order2.png'
  },
  {
    id: 19,
    title: 'Паспорт изделия',
    image: '/images/order3.png'
  },
  {
    id: 20,
    title: 'Сертификат безопасности',
    image: '/images/order4.png'
  },
  {
    id: 21,
    title: 'Протокол испытаний',
    image: '/images/order1.png'
  },
  {
    id: 22,
    title: 'Акт ввода в эксплуатацию',
    image: '/images/order2.png'
  },
  {
    id: 23,
    title: 'Техническое задание',
    image: '/images/order3.png'
  },
  {
    id: 24,
    title: 'Коммерческое предложение',
    image: '/images/order4.png'
  },
  {
    id: 25,
    title: 'Договор на гарантийное обслуживание',
    image: '/images/order1.png'
  },
  {
    id: 26,
    title: 'Счет-фактура №54321',
    image: '/images/order2.png'
  },
  {
    id: 27,
    title: 'Накладная на возврат',
    image: '/images/order3.png'
  },
  {
    id: 28,
    title: 'Акт списания материалов',
    image: '/images/order4.png'
  }
];

export function Orders({ onDownload }: OrdersProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(mockOrders.length / itemsPerSlide);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getCurrentOrders = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return mockOrders.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <div className={styles.ordersSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Заказы</div>
      </div>
      
      <div className={styles.ordersContainer}>
        {getCurrentOrders().map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderImage}>
              <img 
                src={order.image} 
                alt="Документ"
                className={styles.documentImage}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div className={styles.documentPreview}>
                <div className={styles.documentIcon}>📄</div>
              </div>
            </div>
            <div className={styles.orderTitle}>{order.title}</div>
            <button 
              className={styles.downloadBtn}
              onClick={() => onDownload(order.id)}
            >
              <img src="/images/icons/Mask group.png" alt="Download" className={styles.downloadIconImg} />
              <span>Скачать</span>
            </button>
          </div>
        ))}
      </div>

      <div className={styles.sliderDots}>
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default function OrdersSection() {
  const handleDownload = (orderId: number) => {
    console.log(`Downloading order ${orderId}`);
    // Здесь будет логика скачивания
  };

  return <Orders onDownload={handleDownload} />;
}
