import { NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';

export async function GET() {
  try {
    // Тестируем получение пользователей из Bitrix24
    const users = await bitrixService.getUsers();
    
    return NextResponse.json({
      success: true,
      message: 'Bitrix24 integration test successful',
      data: {
        users: users.result || users,
        webhookUrl: 'https://b24-lfbuj2.bitrix24.kz/rest/1/ziht4f6iu0rv7myc'
      }
    });
  } catch (error) {
    console.error('Bitrix24 test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Bitrix24 integration test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Тестируем создание контакта в Bitrix24
    const testContact = await bitrixService.createContact({
      name: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+7 (777) 777-77-77',
      sourceId: 'WEB'
    });

    return NextResponse.json({
      success: true,
      message: 'Test contact created successfully',
      data: testContact
    });
  } catch (error) {
    console.error('Bitrix24 contact creation test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test contact',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
