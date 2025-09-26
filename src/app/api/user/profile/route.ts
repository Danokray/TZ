import { NextRequest, NextResponse } from 'next/server';
import database from '@/services/database';

// Кэш для пользователей (в продакшене используйте Redis или другой кэш)
let userCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export async function GET() {
  try {
    const now = Date.now();
    
    // Проверяем кэш
    if (userCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: userCache
      });
    }

    // В реальном приложении здесь должна быть проверка авторизации
    // и получение ID пользователя из токена/сессии
    // Пока что возвращаем первого пользователя из БД для демонстрации
    
    const users = database.getAllUsers();
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Пользователь не найден'
      }, { status: 404 });
    }

    const user = users[0];
    
    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = user;

    // Обновляем кэш
    userCache = userWithoutPassword;
    cacheTimestamp = now;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Ошибка при получении профиля пользователя'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address } = body;

    // В реальном приложении здесь должна быть проверка авторизации
    // и получение ID пользователя из токена/сессии
    // Пока что обновляем первого пользователя из БД для демонстрации
    
    const users = database.getAllUsers();
    if (users.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Пользователь не найден'
      }, { status: 404 });
    }

    const user = users[0];
    
    // Обновляем данные пользователя
    const updatedUser = database.updateUser(user.id, {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: 'Ошибка при обновлении профиля'
      }, { status: 500 });
    }

    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Ошибка при обновлении профиля пользователя'
    }, { status: 500 });
  }
}
