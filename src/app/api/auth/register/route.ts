import { NextRequest, NextResponse } from 'next/server';
import { RegisterForm, ApiResponse } from '@/types';
import database from '@/services/database';
import bitrixService from '@/services/bitrix';

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

    // Проверяем, существует ли пользователь
    const existingUserByEmail = database.getUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пользователь с таким email уже существует'
      }, { status: 400 });
    }

    const existingUserByLogin = database.getUserByLogin(login);
    if (existingUserByLogin) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Пользователь с таким логином уже существует'
      }, { status: 400 });
    }

    // Создаем пользователя в БД
    const userData = {
      login,
      email,
      password,
      firstName: 'Алим',
      lastName: 'Джолдаспаев',
      phone: '+7 (123) 456-78-90',
      address: 'Алматы, Казахстан'
    };

    const newUser = await database.createUser(userData);

    // Создаем контакт в Битрикс24
    try {
      console.log('🔄 Создаем контакт в Битрикс24...', {
        name: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone
      });
      
      const bitrixResult = await bitrixService.createContact({
        name: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        sourceId: 'WEB'
      });
      
      console.log('✅ Контакт успешно создан в Битрикс24:', bitrixResult);
    } catch (bitrixError) {
      console.error('❌ Ошибка создания контакта в Битрикс24:', bitrixError);
      console.error('Детали ошибки:', bitrixError instanceof Error ? bitrixError.message : 'Unknown error');
      // Не прерываем регистрацию, если Битрикс недоступен
    }

    // Убираем пароль из ответа
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userWithoutPassword,
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