'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { LoginForm, RegisterForm, ApiResponse, ValidationErrors } from '@/types';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Валидация в реальном времени
  useEffect(() => {
    if (!isLogin) {
      const errors: ValidationErrors = {};
      
      if (registerForm.login) {
        const loginError = validateLoginWithMessage(registerForm.login);
        if (loginError) errors.login = loginError;
      }
      
      if (registerForm.email) {
        const emailError = validateEmailWithMessage(registerForm.email);
        if (emailError) errors.email = emailError;
      }
      
      if (registerForm.password) {
        const passwordError = validatePasswordWithMessage(registerForm.password);
        if (passwordError) errors.password = passwordError;
      }
      
      if (registerForm.confirmPassword) {
        const confirmPasswordError = validateConfirmPassword(registerForm.password, registerForm.confirmPassword);
        if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
      }
      
      setValidationErrors(errors);
    }
  }, [registerForm, isLogin]);

  // Валидация логина
  const validateLogin = (login: string): boolean => {
    return login.length >= 3 && /^[a-zA-Z0-9_]+$/.test(login);
  };

  const validateLoginWithMessage = (login: string): string | null => {
    if (login.length < 3) {
      return 'Логин должен содержать минимум 3 символа';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(login)) {
      return 'Логин может содержать только буквы, цифры и _';
    }
    return null;
  };

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailWithMessage = (email: string): string | null => {
    if (!email) {
      return 'Email обязателен';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Введите корректный email';
    }
    return null;
  };

  // Валидация пароля
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push('Минимум 6 символов');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Одна заглавная буква');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Одна цифра');
    }
    return errors;
  };

  const validatePasswordWithMessage = (password: string): string | null => {
    const errors = validatePassword(password);
    return errors.length > 0 ? errors[0] : null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Пароли должны совпадать!';
    }
    return null;
  };

  // Проверка валидности формы
  const isFormValid = (): boolean => {
    if (isLogin) {
      return validateEmail(loginForm.email) && loginForm.password.length > 0;
    } else {
      const loginValid = validateLogin(registerForm.login);
      const emailValid = validateEmail(registerForm.email);
      const passwordErrors = validatePassword(registerForm.password);
      const passwordsMatch = registerForm.password === registerForm.confirmPassword;
      return loginValid && emailValid && passwordErrors.length === 0 && passwordsMatch;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        // Сохраняем пользователя в localStorage (в реальном проекте используйте более безопасный способ)
        localStorage.setItem('user', JSON.stringify(data.data));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    // Валидация на клиенте
    const loginValid = validateLogin(registerForm.login);
    const emailValid = validateEmail(registerForm.email);
    const passwordErrors = validatePassword(registerForm.password);
    const passwordsMatch = registerForm.password === registerForm.confirmPassword;

    if (!loginValid) {
      setValidationErrors({ login: 'Логин должен содержать минимум 3 символа и только буквы, цифры и _' });
      setLoading(false);
      return;
    }

    if (!emailValid) {
      setValidationErrors({ email: 'Некорректный email' });
      setLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      setValidationErrors({ password: passwordErrors.join(', ') });
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setValidationErrors({ confirmPassword: 'Пароли не совпадают' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        // Сохраняем пользователя в localStorage
        localStorage.setItem('user', JSON.stringify(data.data));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.authPage} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.leftSection}>
        <div className={styles.formContainer}>
          <div className={styles.logo}>
            ЛОГОТИП
          </div>
          
          <div className={styles.formTitle}>
            {isLogin ? 'Вход' : 'Регистрация'}
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Mail</label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  placeholder="Введите email"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img 
                      src={showPassword ? "/images/icons/passwordshow.png" : "/images/icons/passwordhide.png"} 
                      alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                      className={styles.eyeIcon}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${!isFormValid() ? styles.disabled : ''}`}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Вход...' : 'Отправить'}
              </button>

              <div className={styles.orText}></div>
              
              <button
                type="button"
                className={styles.switchButton}
                onClick={() => setIsLogin(false)}
              >
                Регистрация
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="login">Логин</label>
                <div className={styles.passwordInput}>
                  <input
                    type="text"
                    id="login"
                    value={registerForm.login}
                    onChange={(e) => setRegisterForm({ ...registerForm, login: e.target.value })}
                    required
                    placeholder="Введите логин"
                    className={validationErrors.login ? styles.error : ''}
                  />
                  {validationErrors.login && (
                    <div className={styles.errorIcon}>!</div>
                  )}
                </div>
                {validationErrors.login && (
                  <div className={styles.fieldError}>{validationErrors.login}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Mail</label>
                <div className={styles.passwordInput}>
                  <input
                    type="email"
                    id="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                    placeholder="Введите email"
                    className={validationErrors.email ? styles.error : ''}
                  />
                  {validationErrors.email && (
                    <div className={styles.errorIcon}>!</div>
                  )}
                </div>
                {validationErrors.email && (
                  <div className={styles.fieldError}>{validationErrors.email}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Пароль</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    placeholder="Введите пароль"
                    className={validationErrors.password ? styles.error : ''}
                  />
                  {validationErrors.password ? (
                    <div className={styles.errorIcon}>!</div>
                  ) : (
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <img 
                        src={showPassword ? "/images/icons/passwordshow.png" : "/images/icons/passwordhide.png"} 
                        alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        className={styles.eyeIcon}
                      />
                    </button>
                  )}
                </div>
                {validationErrors.password && (
                  <div className={styles.fieldError}>{validationErrors.password}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Повторите пароль</label>
                <div className={styles.passwordInput}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                    placeholder="Повторите пароль"
                    className={validationErrors.confirmPassword ? styles.error : ''}
                  />
                  {validationErrors.confirmPassword ? (
                    <div className={styles.errorIcon}>!</div>
                  ) : (
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <img 
                        src={showConfirmPassword ? "/images/icons/passwordshow.png" : "/images/icons/passwordhide.png"} 
                        alt={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                        className={styles.eyeIcon}
                      />
                    </button>
                  )}
                </div>
                {validationErrors.confirmPassword && (
                  <div className={styles.fieldError}>{validationErrors.confirmPassword}</div>
                )}
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${!isFormValid() ? styles.disabled : ''}`}
                disabled={loading || !isFormValid()}
              >
                {loading ? 'Регистрация...' : 'Отправить'}
              </button>

              <div className={styles.orText}></div>
              
              <button
                type="button"
                className={styles.switchButton}
                onClick={() => setIsLogin(true)}
              >
                Вход
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.backgroundImage}>
          <img 
            src="/images/car.png" 
            alt="Автомобиль" 
            className={styles.carImage}
          />
        </div>
      </div>
    </div>
  );
}
