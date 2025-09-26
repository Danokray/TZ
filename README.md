# TechZ Project

Тестовый проект на Next.js с интеграцией Bitrix24 API.

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **SCSS модули** - стилизация
- **Swiper** - слайдер на дашборде
- **better-sqlite3** - база данных
- **Bitrix24 API** - интеграция через вебхук

## Структура проекта

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API роуты
│   │   ├── auth/          # Авторизация
│   │   ├── bitrix/        # Bitrix24 интеграция
│   │   └── dashboard/     # Дашборд API
│   ├── auth/              # Страница авторизации
│   ├── dashboard/         # Дашборд
│   ├── payments/          # Управление платежами
│   ├── layout.tsx         # Основной layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
├── services/              # Сервисы
│   ├── database.ts        # Работа с БД
│   └── bitrix.ts          # Bitrix24 API
├── styles/                # Глобальные стили
│   └── globals.scss       # Основные стили
└── types/                 # TypeScript типы
    └── index.ts           # Основные типы
```

## Установка и запуск

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Настройка переменных окружения:**
   Создайте файл `.env.local` в корне проекта:
   ```env
   BITRIX_WEBHOOK_URL=https://your-domain.bitrix24.ru/rest/1/your-webhook-code
   BITRIX_API_KEY=your-api-key-here
   DATABASE_PATH=./database.sqlite
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. **Запуск в режиме разработки:**
   ```bash
   npm run dev
   ```

4. **Открыть в браузере:**
   http://localhost:3000

## Функциональность

### Страницы

1. **Авторизация/Регистрация** (`/auth`)
   - Форма входа
   - Форма регистрации
   - Валидация данных
   - Сохранение в localStorage

2. **Дашборд** (`/dashboard`)
   - Статистика пользователей и платежей
   - Слайдер с новостями
   - Последние платежи
   - Навигация

3. **Платежи** (`/payments`)
   - Список платежей
   - Создание новых платежей
   - Управление статусами
   - Адаптивный дизайн

### API Endpoints

- `POST /api/auth/login` - Авторизация
- `POST /api/auth/register` - Регистрация
- `GET /api/dashboard/stats` - Статистика дашборда
- `POST /api/bitrix/webhook` - Bitrix24 вебхук

### База данных

Используется SQLite с таблицами:
- `users` - пользователи
- `payments` - платежи

## Интеграция с Bitrix24

### Настройка вебхука

1. В Bitrix24 создайте входящий вебхук
2. Укажите URL: `https://your-domain.com/api/bitrix/webhook`
3. Выберите права доступа
4. Скопируйте URL вебхука в переменную `BITRIX_WEBHOOK_URL`

### Поддерживаемые события

- `ONCRMDEALADD` - добавление сделки
- `ONCRMDEALUPDATE` - обновление сделки
- `ONCRMLEADADD` - добавление лида
- `ONCRMLEADUPDATE` - обновление лида

## Адаптивность

Проект полностью адаптивен:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (до 767px)

## Стилизация

- SCSS модули для каждого компонента
- CSS переменные для цветов и размеров
- Адаптивная сетка
- Современный дизайн с градиентами и тенями

## Безопасность

⚠️ **Важно для продакшена:**
- Используйте bcrypt для хеширования паролей
- Настройте JWT токены вместо localStorage
- Добавьте CORS настройки
- Используйте HTTPS
- Настройте rate limiting

## Разработка

### Добавление новых страниц

1. Создайте папку в `src/app/`
2. Добавьте `page.tsx` и `page.module.scss`
3. Настройте роутинг в `layout.tsx` если нужно

### Добавление API роутов

1. Создайте папку в `src/app/api/`
2. Добавьте `route.ts` с методами GET/POST
3. Используйте типы из `src/types/`

### Работа с базой данных

Используйте сервис `database.ts`:
```typescript
import database from '@/services/database';

// Создание пользователя
const user = database.createUser(userData);

// Получение пользователя
const user = database.getUserByEmail(email);
```

## Сборка для продакшена

```bash
npm run build
npm start
```

## Лицензия

MIT
