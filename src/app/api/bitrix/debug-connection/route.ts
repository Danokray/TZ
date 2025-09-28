import { NextResponse } from 'next/server';
import { getBitrixWebhookUrl } from '@/config/bitrix';

export async function GET() {
  try {
    const webhookUrl = getBitrixWebhookUrl();
    console.log('🔍 Диагностика подключения к Битрикс24...');
    console.log('📡 URL вебхука:', webhookUrl);
    
    // Тестируем простой запрос
    const testUrl = `${webhookUrl}profile`;
    console.log('🌐 Тестовый URL:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Статус ответа:', response.status);
    console.log('📡 Статус текст:', response.statusText);
    console.log('📡 Заголовки:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Тело ответа:', responseText);
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: {
          url: testUrl,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseText
        }
      }, { status: 500 });
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Не удалось распарсить JSON ответ',
        details: {
          url: testUrl,
          responseText: responseText,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown error'
        }
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        webhookUrl,
        testUrl,
        response: result
      },
      message: 'Подключение к Битрикс24 успешно!'
    });
    
  } catch (error) {
    console.error('❌ Ошибка диагностики:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Ошибка подключения к Битрикс24',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        webhookUrl: getBitrixWebhookUrl()
      }
    }, { status: 500 });
  }
}
