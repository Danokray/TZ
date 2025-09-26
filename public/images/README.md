# Папка для изображений

Эта папка содержит статические изображения, доступные по прямым URL.

## Структура:

- `public/images/` - изображения, доступные по URL `/images/filename.jpg`
- `src/assets/images/` - изображения для импорта в компоненты

## Использование:

### В компонентах (public/images):
```jsx
<img src="/images/logo.png" alt="Logo" />
```

### В CSS (public/images):
```css
.background {
  background-image: url('/images/background.jpg');
}
```

### Импорт в компонентах (src/assets/images):
```jsx
import logo from '@/assets/images/logo.png';

<img src={logo} alt="Logo" />
```

## Рекомендации:

- Используйте `public/images/` для больших изображений и фонов
- Используйте `src/assets/images/` для иконок и логотипов
- Оптимизируйте изображения перед добавлением
- Используйте современные форматы (WebP, AVIF) когда возможно
