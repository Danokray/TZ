import { NextRequest, NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';
import { BitrixWebhook, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Валидация вебхука
    if (!body.event || !body.data) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid webhook format'
      }, { status: 400 });
    }

    const webhookData: BitrixWebhook = {
      event: body.event,
      data: body.data,
      timestamp: new Date().toISOString()
    };

    // Обработка вебхука
    const result = await bitrixService.handleWebhook(webhookData);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// GET метод для проверки работоспособности
export async function GET() {
  return NextResponse.json<ApiResponse>({
    success: true,
    message: 'Bitrix webhook endpoint is working'
  });
}
