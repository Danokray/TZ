import { NextRequest, NextResponse } from 'next/server';
import bitrixService from '@/services/bitrix';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, stageId } = body;

    if (!dealId || !stageId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Deal ID and Stage ID are required'
      }, { status: 400 });
    }

    console.log('🔄 Обновляем стадию сделки:', { dealId, stageId });
    
    // Обновляем стадию сделки в Битрикс24
    const result = await bitrixService.updateDeal(dealId, {
      STAGE_ID: stageId
    });
    
    console.log('✅ Результат обновления сделки:', result);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: 'Deal stage updated successfully'
    });

  } catch (error) {
    console.error('Error updating deal stage:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update deal stage'
    }, { status: 500 });
  }
}
