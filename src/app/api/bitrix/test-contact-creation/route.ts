import { NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';
import { ApiResponse } from '@/types';

export async function POST() {
  try {
    console.log('🧪 Тестируем создание контакта с детальной диагностикой...');
    
    // Тестируем создание контакта с уникальным email
    const testEmail = `test-${Date.now()}@example.com`;
    const contactData = {
      name: 'Test',
      lastName: 'User',
      email: testEmail,
      phone: '+7 (777) 777-77-77',
      sourceId: 'WEB'
    };
    
    console.log('📞 Данные для создания контакта:', contactData);
    
    const result = await bitrixService.createContact(contactData);
    
    console.log('✅ Результат создания контакта:', result);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        contactData,
        result,
        message: 'Контакт успешно создан!'
      },
      message: 'Test contact created successfully'
    });
    
  } catch (error) {
    console.error('❌ Ошибка создания контакта:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ошибка создания контакта',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
