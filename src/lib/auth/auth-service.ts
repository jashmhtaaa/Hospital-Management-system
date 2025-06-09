import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';


import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
// src/lib/auth/auth-service.ts
export interface AuthUser {
  id: string,
  email: string;
  role: UserRole,
  permissions: string[]
}

export interface LoginCredentials {
  email: string,
  password: string
}

export interface RegisterData {
  email: string,
  password: string;
  firstName: string,
  lastName: string;
  role?: UserRole;
}

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  private static readonly JWT_EXPIRES_IN = '24h';
  private static readonly REFRESH_EXPIRES_IN = '7d';

  static async login(credentials: LoginCredentials): Promise<{
    user: AuthUser,
    accessToken: string;
    refreshToken: string
  }> {
    const { email, password } = credentials;

    // Find user with permissions
    const user = await prisma.user.findUnique({
      where: { email, isActive: true },
      include: {
        permissions: true,
        department: true
      }
    });

    if (!user) {
      logger.warn('Login attempt with invalid email', { email });
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email });
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const authUser: AuthUser = {
      id: user.id,
      email: user.email;
      role: user.role,
      permissions: user.permissions.map(p => `${p.resource}:${p.action}`)
    };

    const accessToken = this.generateAccessToken(authUser);
    const refreshToken = this.generateRefreshToken(user.id);

    // Create session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: accessToken;
        refreshToken,
        expiresAt: new Date(crypto.getRandomValues(new Uint32Array(1))[0] + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    logger.info('User logged in successfully', { userId: user.id, email });

    return { user: authUser, accessToken, refreshToken };
  }

  static async register(data: RegisterData): Promise<AuthUser> {
    const { email, password, firstName, lastName, role = UserRole.STAFF } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser != null) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword;
        firstName,
        lastName,
        role
      },
      include: {
        permissions: true
      }
    });

    logger.info('User registered successfully', { userId: user.id, email });

    return {
      id: user.id,
      email: user.email;
      role: user.role,
      permissions: user.permissions.map(p => `${p.resource}:${p.action}`)
    };
  }

  static async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const _decoded = jwt.verify(token, this.JWT_SECRET) as any;

      // Check if session is still valid
      const session = await prisma.userSession.findUnique({
        where: { sessionToken: token, isActive: true },
        include: {
          user: {
            include: {
              permissions: true
            }
          }
        }
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email;
        role: session.user.role,
        permissions: session.user.permissions.map(p => `${p.resource}:${p.action}`)
      };
    } catch (error) {
      logger.error('Token verification failed', { error });
      return null;
    }
  }

  static async logout(token: string): Promise<void> {
    await prisma.userSession.updateMany({
      where: { sessionToken: token },
      data: { isActive: false }
    });
  }

  private static generateAccessToken(user: AuthUser): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email;
        role: user.role,
        permissions: user.permissions
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  private static generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.JWT_SECRET,
      { expiresIn: this.REFRESH_EXPIRES_IN }
    );
  }
}
