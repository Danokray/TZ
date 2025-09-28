import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, DashboardStats } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Моковые данные для быстрой загрузки
    const mockStats: DashboardStats = {
      totalUsers: 150,
      totalPayments: 89,
      totalRevenue: 125000,
      recentPayments: [
        {
          id: 1,
          userId: 1,
          amount: 5000,
          currency: 'RUB',
          description: 'Оплата заказа #12345',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          userId: 2,
          amount: 3200,
          currency: 'RUB',
          description: 'Оплата заказа #12346',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: mockStats,
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
