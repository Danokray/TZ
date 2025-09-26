import React from 'react';
import styles from './ImageExample.module.scss';

// Пример импорта изображения из assets
// import logo from '@/assets/images/logo.png';

interface ImageExampleProps {
  src?: string;
  alt: string;
  className?: string;
}

export const ImageExample: React.FC<ImageExampleProps> = ({ 
  src = '/images/placeholder.jpg', 
  alt, 
  className 
}) => {
  return (
    <div className={`${styles.imageContainer} ${className || ''}`}>
      <img 
        src={src} 
        alt={alt}
        className={styles.image}
        loading="lazy"
      />
    </div>
  );
};

export default ImageExample;
