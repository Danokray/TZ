import { NextRequest, NextResponse } from 'next/server';
import database from '@/services/database';
import bitrixService from '@/services/bitrix';
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

    if (!/(?=.*[A-Z])/.test(password)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пароль должен содержать минимум одну заглавную букву'
      }, { status: 400 });
    }

    if (!/(?=.*\d)/.test(password)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пароль должен содержать минимум одну цифру'
      }, { status: 400 });
    }

    // Проверка на существование пользователя
    const existingUserByEmail = database.getUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пользователь с таким email уже существует'
      }, { status: 409 });
    }

    const existingUserByLogin = database.getUserByLogin(login);
    if (existingUserByLogin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пользователь с таким логином уже существует'
      }, { status: 409 });
    }

    // Создание пользователя в локальной БД
    const newUser = await database.createUser({
      login,
      email,
      password,
      firstName: login, // Используем логин как имя
      lastName: 'User',
      phone: null
    });

    // Создание контакта в Bitrix24
    try {
      await bitrixService.createContact({
        name: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        sourceId: 'WEB'
      });
    } catch (bitrixError) {
      console.error('Bitrix24 contact creation failed:', bitrixError);
      // Не прерываем регистрацию, если Bitrix24 недоступен
    }

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userWithoutPassword,
      message: 'Пользователь успешно зарегистрирован'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}
