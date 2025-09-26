import { NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';

export async function POST() {
  try {
    // Создаем тестовый контакт с уникальным email
    const testEmail = `test-${Date.now()}@example.com`;
    
    const result = await bitrixService.createContact({
      name: 'Test',
      lastName: 'User',
      email: testEmail,
      phone: '+7 (777) 777-77-77',
      sourceId: 'WEB'
    });

    return NextResponse.json({
      success: true,
      message: 'Test contact created successfully',
      data: {
        result,
        testEmail,
        webhookUrl: 'https://b24-lfbuj2.bitrix24.kz/rest/1/ziht4f6iu0rv7myc'
      }
    });
  } catch (error) {
    console.error('Test contact creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create test contact',
      details: error instanceof Error ? error.message : 'Unknown error',
      webhookUrl: 'https://b24-lfbuj2.bitrix24.kz/rest/1/ziht4f6iu0rv7myc'
    }, { status: 500 });
  }
}
