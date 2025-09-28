import { NextRequest, NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    
    // Получаем сделки из Битрикс24
    const deals = await bitrixService.getDeals(filter ? JSON.parse(filter) : {});
    
    // Преобразуем данные сделок в формат платежей
    const payments = deals.result?.map((deal: any) => ({
      id: deal.ID,
      userId: 1, // В реальном приложении нужно связать с пользователем
      amount: parseFloat(deal.OPPORTUNITY) || 0,
      currency: deal.CURRENCY_ID || 'RUB',
      description: deal.TITLE || `Сделка ${deal.ID}`,
      status: getPaymentStatus(deal.STAGE_ID),
      createdAt: deal.DATE_CREATE,
      updatedAt: deal.DATE_MODIFY || deal.DATE_CREATE,
      bitrixDealId: deal.ID,
      stageId: deal.STAGE_ID
    })) || [];

    return NextResponse.json<ApiResponse>({
      success: true,
      data: payments,
      message: 'Deals retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch deals from Bitrix24'
    }, { status: 500 });
  }
}

// Функция для определения статуса платежа на основе стадии сделки
function getPaymentStatus(stageId: string): 'pending' | 'completed' | 'failed' | 'cancelled' {
  // В реальном приложении нужно настроить соответствие стадий Битрикс24
  // Пока используем простую логику
  if (stageId === 'WON' || stageId === 'WON2') {
    return 'completed';
  } else if (stageId === 'LOSE' || stageId === 'LOSE2') {
    return 'cancelled';
  } else if (stageId === 'NEW' || stageId === 'PREPARATION') {
    return 'pending';
  } else {
    return 'pending';
  }
}
