import { NextRequest, NextResponse } from 'next/server';
import { LoginForm, ApiResponse } from '@/types';
import database from '@/services/database';

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

    // Ищем пользователя по email
    const user = database.getUserByEmail(email);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пользователь не найден'
      }, { status: 401 });
    }

    // Проверяем пароль
    const isPasswordValid = await database.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Неверный пароль'
      }, { status: 401 });
    }

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userWithoutPassword,
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