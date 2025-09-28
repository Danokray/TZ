'use client';

import { useState, useEffect } from 'react';
import styles from './ProfileLarge.module.scss';

export function ProfileLarge() {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState({
    firstName: 'Алим',
    email: 'alim@example.com',
    phone: '+7 (123) 456-78-90',
    address: 'Алматы, Казахстан'
  });

  const validateName = (name: string) => {
    // Проверяем, содержит ли имя только кириллические символы
    const cyrillicRegex = /^[а-яё\s]+$/i;
    return cyrillicRegex.test(name);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Валидация для поля имени
    if (name === 'firstName') {
      if (value && !validateName(value)) {
        setErrors(prev => ({
          ...prev,
          firstName: 'Неправильное поле ввода'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.firstName;
          return newErrors;
        });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Автоматическое сохранение при изменении
    handleSave();
  };

  const handleSave = () => {
    // Сохранение данных
    console.log('Сохранение данных:', formData);
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Профиль</div>
      </div>
      
      <div className={styles.profileContent}>
        <div className={styles.profileAvatar}>
          <img 
            src="/images/icons/person.png" 
            alt="Profile" 
            className={styles.avatarImage}
          />
        </div>
        
        <div className={styles.profileFields}>
          <div className={styles.field}>
            <label>Имя</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Введите имя"
              className={`${styles.editable} ${errors.firstName ? styles.error : ''}`}
            />
            {errors.firstName && (
              <div className={styles.errorMessage}>
                {errors.firstName}
              </div>
            )}
          </div>
          
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите email"
              className={styles.editable}
            />
          </div>
          
          <div className={styles.field}>
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Введите телефон"
              className={styles.editable}
            />
          </div>
          
          <div className={styles.field}>
            <label>Адрес</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Введите адрес"
              className={styles.editable}
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              className={styles.editButton} 
              onClick={handleSave}
            >
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
