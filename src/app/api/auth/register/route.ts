import { NextRequest, NextResponse } from 'next/server';
import { RegisterForm, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterForm = await request.json();
    const { login, email, password, confirmPassword } = body;

    // Валидация
    if (!login || !email || !password || !confirmPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Все поля должны быть заполнены'
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пароли не совпадают'
      }, { status: 400 });
    }

    // Валидация пароля
    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пароль должен содержать минимум 6 символов'
      }, { status: 400 });
    }

    // Моковая регистрация - всегда успешная
    const mockUser = {
      id: 1,
      login: login,
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
      message: 'Регистрация успешна'
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Ошибка регистрации'
    }, { status: 500 });
  }
}