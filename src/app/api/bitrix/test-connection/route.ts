import { NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    console.log('🔍 Тестируем подключение к Битрикс24...');
    
    // Тестируем получение пользователей
    const users = await bitrixService.getUsers();
    console.log('✅ Пользователи получены:', users);
    
    // Тестируем получение стадий сделок
    const stages = await bitrixService.getDealStages();
    console.log('✅ Стадии сделок получены:', stages);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        users: users.result || users,
        stages: stages.result || stages,
        message: 'Подключение к Битрикс24 успешно!'
      },
      message: 'Bitrix24 connection test successful'
    });
    
  } catch (error) {
    console.error('❌ Ошибка подключения к Битрикс24:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ошибка подключения к Битрикс24',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('🧪 Тестируем создание тестового контакта...');
    
    // Создаем тестовый контакт
    const testContact = await bitrixService.createContact({
      name: 'Test',
      lastName: 'User',
      email: `test-${Date.now()}@example.com`,
      phone: '+7 (777) 777-77-77',
      sourceId: 'WEB'
    });
    
    console.log('✅ Тестовый контакт создан:', testContact);
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: testContact,
      message: 'Test contact created successfully'
    });
    
  } catch (error) {
    console.error('❌ Ошибка создания тестового контакта:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ошибка создания тестового контакта',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
