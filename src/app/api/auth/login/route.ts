import { NextRequest, NextResponse } from 'next/server';
import database from '@/services/database';
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

    // Поиск пользователя
    const user = database.getUserByEmail(email);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пользователь не найден'
      }, { status: 401 });
    }

    // Проверка пароля с bcrypt
    const isPasswordValid = await database.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Неверный пароль'
      }, { status: 401 });
    }

    // Успешная авторизация
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: userWithoutPassword,
      message: 'Успешная авторизация'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}
