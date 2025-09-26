import { NextRequest, NextResponse } from 'next/server';
import database from '@/services/database';
import { ApiResponse, DashboardStats } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Получаем статистику из базы данных
    const stats = database.getDashboardStats();

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats,
      message: 'Dashboard stats retrieved successfully'
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
