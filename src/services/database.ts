import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Payment } from '@/types';

class DatabaseService {
  private db: Database.Database;
  private static instance: DatabaseService;

  constructor() {
    // Создаем базу данных в корне проекта
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    this.db = new Database(dbPath);
    this.initTables();
  }

  // Singleton pattern для предотвращения множественных подключений
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initTables() {
    // Создаем таблицу пользователей
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          login TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          phone TEXT,
          address TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Создаем таблицу платежей
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'RUB',
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);

    // Создаем индексы для оптимизации
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(userId);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);
  }

  // Методы для работы с пользователями
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const stmt = this.db.prepare(`
      INSERT INTO users (login, email, password, firstName, lastName, phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.login,
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.phone || null
    );

    return this.getUserById(result.lastInsertRowid as number)!;
  }

  getUserById(id: number): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }

  getUserByEmail(email: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  }

  getUserByLogin(login: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE login = ?');
    return stmt.get(login) as User | null;
  }

  getAllUsers(): User[] {
    const stmt = this.db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
    return stmt.all() as User[];
  }

  // Проверка пароля
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  updateUser(id: number, userData: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    const fields = [];
    const values = [];

    if (userData.email) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.password) {
      fields.push('password = ?');
      values.push(userData.password);
    }
    if (userData.firstName) {
      fields.push('firstName = ?');
      values.push(userData.firstName);
    }
    if (userData.lastName) {
      fields.push('lastName = ?');
      values.push(userData.lastName);
    }
    if (userData.phone !== undefined) {
      fields.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.address !== undefined) {
      fields.push('address = ?');
      values.push(userData.address);
    }

    if (fields.length === 0) return this.getUserById(id);

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = this.db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getUserById(id);
  }

  // Методы для работы с платежами
  createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
    const stmt = this.db.prepare(`
      INSERT INTO payments (userId, amount, currency, description, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      paymentData.userId,
      paymentData.amount,
      paymentData.currency,
      paymentData.description,
      paymentData.status
    );

    return this.getPaymentById(result.lastInsertRowid as number)!;
  }

  getPaymentById(id: number): Payment | null {
    const stmt = this.db.prepare('SELECT * FROM payments WHERE id = ?');
    return stmt.get(id) as Payment | null;
  }

  getPaymentsByUserId(userId: number): Payment[] {
    const stmt = this.db.prepare('SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC');
    return stmt.all(userId) as Payment[];
  }

  getAllPayments(): Payment[] {
    const stmt = this.db.prepare('SELECT * FROM payments ORDER BY createdAt DESC');
    return stmt.all() as Payment[];
  }

  updatePaymentStatus(id: number, status: Payment['status']): Payment | null {
    const stmt = this.db.prepare(`
      UPDATE payments 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    stmt.run(status, id);
    return this.getPaymentById(id);
  }

  // Статистика для дашборда
  getDashboardStats() {
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const paymentCount = this.db.prepare('SELECT COUNT(*) as count FROM payments').get() as { count: number };
    const revenueResult = this.db.prepare(`
      SELECT SUM(amount) as total 
      FROM payments 
      WHERE status = 'completed'
    `).get() as { total: number | null };

    const recentPayments = this.db.prepare(`
      SELECT * FROM payments 
      ORDER BY createdAt DESC 
      LIMIT 10
    `).all() as Payment[];

    return {
      totalUsers: userCount.count,
      totalPayments: paymentCount.count,
      totalRevenue: revenueResult.total || 0,
      recentPayments
    };
  }

  // Закрытие соединения
  close() {
    this.db.close();
  }
}

// Создаем единственный экземпляр базы данных
const database = DatabaseService.getInstance();

export { DatabaseService as Database };
export default database;
