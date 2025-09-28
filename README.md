TechZ Project

Тестовый проект на Next.js с подключением к Bitrix24 API.

Технологии

Next.js 14

TypeScript

SCSS модули

Swiper (слайдер на дашборде)

better-sqlite3 (локальная база)

Bitrix24 API через вебхук

Структура

src/app/ → страницы и API роуты

auth — регистрация/авторизация

dashboard — дашборд

payments — платежи

components/ → React-компоненты

services/ → работа с БД и Bitrix API

styles/ → SCSS

types/ → типы TS

Как запустить

Установить зависимости:

npm install
Настроить .env.local:
BITRIX_WEBHOOK_URL=ссылка-на-вебхук
DATABASE_PATH=./database.sqlite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=секрет
Запуск:
npm run dev
Открыть в браузере: http://localhost:3000
Страницы
Auth — вход и регистрация, валидация, сохранение пользователя.
Dashboard — статистика, слайдер (Swiper), последние платежи, блок «Профиль».
Payments — список платежей, кнопка «Оплатить», работа с API Битрикс.
API роуты

POST /api/auth/login — авторизация

POST /api/auth/register — регистрация

GET /api/dashboard/stats — статистика

POST /api/bitrix/webhook — интеграция с Bitrix

База данных

SQLite (better-sqlite3):

users — пользователи

payments — платежи

Bitrix24

Вебхук в CRM с нужными правами.

Поддержка событий: сделки, лиды (добавление/обновление).

Адаптивность

Проект работает на:

Desktop

Tablet

Mobile

Стили

SCSS модули + CSS переменные.

Безопасность

Хеширование паролей через bcrypt

JWT вместо localStorage

CORS + HTTPS

Rate limiting

Разработка

Новая страница → папка в src/app/ + page.tsx.

Новый API роут → src/app/api/ + route.ts.

Работа с БД через services/database.ts.

Сборка
npm run build
npm start