// Конфигурация Битрикс24
export const BITRIX_CONFIG = {
  // Ваш новый вебхук из Битрикс24
  WEBHOOK_URL: 'https://b24-lfbuj2.bitrix24.kz/rest/1/2yjxzw35emb9bjva/',
  
  // Настройки для тестирования
  TEST_MODE: process.env.NODE_ENV === 'development',
  
  // Таймаут для запросов (в миллисекундах)
  REQUEST_TIMEOUT: 10000,
  
  // Количество повторных попыток при ошибке
  MAX_RETRIES: 3
};

// Функция для получения URL вебхука
export function getBitrixWebhookUrl(): string {
  const url = process.env.BITRIX_WEBHOOK_URL || BITRIX_CONFIG.WEBHOOK_URL;
  
  console.log('🔗 Используется вебхук Битрикс24:', url);
  
  return url;
}
