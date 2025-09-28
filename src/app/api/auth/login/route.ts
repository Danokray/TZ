import { NextRequest, NextResponse } from 'next/server';
import { LoginForm, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginForm = await request.json();
    const { email, password } = body;

    // Валидация
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email и пароль обязательны'
      }, { status: 400 });
    }

    // Моковая авторизация - принимаем любой email/пароль
    const mockUser = {
      id: 1,
      login: 'alim',
      email: email,
      firstName: 'Алим',
      lastName: 'Джолдаспаев',
      phone: '+7 (123) 456-78-90',
      address: 'Алматы, Казахстан',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      data: mockUser,
      message: 'Авторизация успешна'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ошибка авторизации'
    }, { status: 500 });
  }
}