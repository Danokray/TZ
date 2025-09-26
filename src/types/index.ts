// Типы для пользователей
export interface User {
  id: number;
  login: string;
  email: string;
  password: string; // В реальном проекте должен быть хеширован
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для форм авторизации
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Типы для валидации
export interface ValidationErrors {
  login?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Типы для платежей
export interface Payment {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Типы для API ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Типы для Bitrix24
export interface BitrixWebhook {
  event: string;
  data: any;
  timestamp: string;
}

// Типы для дашборда
export interface DashboardStats {
  totalUsers: number;
  totalPayments: number;
  totalRevenue: number;
  recentPayments: Payment[];
}

// Типы для компонентов
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}
