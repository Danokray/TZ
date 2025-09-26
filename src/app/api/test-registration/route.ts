import { NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';

export async function POST() {
  try {
    // Тестируем создание контакта как при регистрации
    const testContact = await bitrixService.createContact({
      name: 'TestUser',
      lastName: 'User',
      email: `test-${Date.now()}@example.com`,
      sourceId: 'WEB'
    });

    return NextResponse.json({
      success: true,
      message: 'Test contact created successfully',
      data: testContact,
      webhookUrl: 'https://b24-lfbuj2.bitrix24.kz/rest/1/ziht4f6iu0rv7myc'
    });
  } catch (error) {
    console.error('Test registration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test contact creation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
