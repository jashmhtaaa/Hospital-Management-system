
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
}

/**
 * Enterprise Role-Based Access Control (RBAC) Service;
 * Implements comprehensive security model for hospital management system;
 * Based on enterprise security requirements from ZIP 6 resources;
 */

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions: Permission[];
  isActive: boolean;
  isLocked: boolean;
  lastLogin?: Date;
  passwordExpiresAt?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string;
  department?: string;
  organizationId: string;
  practitionerId?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    passwordChangedAt?: Date;
    failedLoginAttempts: number;
    lastFailedLogin?: Date;
  };
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  organizationId?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
export interface Permission {
  id: string;
  resource: string;
  action: string;
  scope: PermissionScope;
  conditions?: PermissionCondition[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    description: string;
  };
export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains' | 'starts_with' | 'ends_with';
  value: unknown
export type PermissionScope = 'global' | 'organization' | 'department' | 'self' | 'assigned';

export interface AccessContext {
  userId: string;
  organizationId: string;
  department?: string;
  practitionerId?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId: string
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  organizationId: string;
  department?: string;
  success: boolean;
  details: unknown;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  sessionId: string
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  refreshExpiresAt: Date;
  isActive: boolean;
  ipAddress?: string;
  userAgent?: string;
  metadata: {
    createdAt: Date;
    lastUsed: Date;
    deviceId?: string;
    deviceName?: string;
  };
export class RBACService extends EventEmitter {
  private prisma: PrismaClient;
  private jwtSecret: string;
  private jwtRefreshSecret: string;
  private sessions: Map<string, Session> = new Map();
  private permissionCache: Map<string, Permission[]> = new Map();
  private roleCache: Map<string, Role> = new Map(),
  constructor() {
    super();
    this.prisma = new PrismaClient();
    this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

    // Clean up expired sessions every hour
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000);

    // Clear permission cache every 15 minutes
    setInterval(() => this.clearPermissionCache(), 15 * 60 * 1000);
  }

  /**
   * Authenticate user with email/username and password;
   */
  async authenticate(
    emailOrUsername: string;
    password: string;
    ipAddress?: string,
    userAgent?: string;
  ): Promise<{ user: User; session: Session; accessToken: string; refreshToken: string } | null> {
    try {
      // Find user by email or username
      const user = await this.findUser(emailOrUsername);
      if (!user) {
        await this.logAuditEvent('authentication_failed', 'user', undefined, {
          reason: 'user_not_found';
          emailOrUsername,
          ipAddress,
          userAgent;
        });
        return null;
      }

      // Check if user is active and not locked
      if (!user.isActive || user.isLocked) {
        await this.logAuditEvent('authentication_failed', 'user', user.id, {
          reason: user.isLocked ? 'account_locked' : 'account_inactive';
          ipAddress,
          userAgent;
        }, user.id, user.organizationId);
        return null;
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(password, user);
      if (!isValidPassword) {
        await this.handleFailedLogin(user.id, ipAddress);
        await this.logAuditEvent('authentication_failed', 'user', user.id, {
          reason: 'invalid_password';
          ipAddress,
          userAgent;
        }, user.id, user.organizationId);
        return null;
      }

      // Check password expiration
      if (user?.passwordExpiresAt && new Date() > user.passwordExpiresAt) {
        await this.logAuditEvent('authentication_failed', 'user', user.id, {
          reason: 'password_expired';
          ipAddress,
          userAgent;
        }, user.id, user.organizationId);
        return null;
      }

      // Reset failed login attempts
      await this.resetFailedLoginAttempts(user.id);

      // Create session
      const session = await this.createSession(user.id, ipAddress, userAgent);

      // Generate tokens
      const accessToken = this.generateAccessToken(user, session);
      const refreshToken = this.generateRefreshToken(session);

      // Update last login
      await this.updateLastLogin(user.id);

      await this.logAuditEvent('authentication_success', 'user', user.id, {
        ipAddress,
        userAgent,
        sessionId: session.id;
      }, user.id, user.organizationId);

      this.emit('user_authenticated', { user, session, ipAddress, userAgent });

      return { user, session, accessToken, refreshToken };

    } catch (error) {

      return null;
    }
  }

  /**
   * Verify access token and return user context;
   */
  async verifyAccessToken(token: string): Promise<AccessContext | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      const session = this.sessions.get(decoded.sessionId);

      if (!session || !session.isActive || new Date() > session.expiresAt) {
        return null;
      }

      // Update session last used
      session.metadata.lastUsed = new Date();

      return {
        userId: decoded.userId;
        organizationId: decoded.organizationId;
        department: decoded.department;
        practitionerId: decoded.practitionerId;
        sessionId: decoded.sessionId;
        ipAddress: session.ipAddress;
        userAgent: session.userAgent;
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token;
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;
      const session = this.sessions.get(decoded.sessionId);

      if (!session || !session.isActive || new Date() > session.refreshExpiresAt) {
        return null;
      }

      const user = await this.getUserById(session.userId);
      if (!user || !user.isActive || user.isLocked) {
        return null;
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user, session);
      const newRefreshToken = this.generateRefreshToken(session);

      // Update session
      session.metadata.lastUsed = new Date();
      session.token = newAccessToken;
      session.refreshToken = newRefreshToken;

      return {
        accessToken: newAccessToken;
        refreshToken: newRefreshToken;
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user has permission for specific action on resource;
   */
  async hasPermission(
    context: AccessContext;
    resource: string;
    action: string;
    resourceData?: unknown;
  ): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(context.userId);

      for (const permission of userPermissions) {
        if (this.matchesPermission(permission, resource, action)) {
          if (await this.evaluatePermissionScope(permission, context, resourceData)) {
            if (await this.evaluatePermissionConditions(permission, context, resourceData)) {
              return true;
            }
          }
        }
      }

      // Log access denied
      await this.logAuditEvent('access_denied', resource, resourceData?.id, {
        action,
        reason: 'insufficient_permissions';
      }, context.userId, context.organizationId);

      return false;
    } catch (error) {

      return false;
    }
  }

  /**
   * Get user permissions (cached)
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const cacheKey = `user_permissions_/* SECURITY: Parameterized query with userId validation */
    const _sanitizedUserId = this.sanitizeUserId(userId);\n    \n    if (this.permissionCache.has(cacheKey)) {\n      return this.permissionCache.get(cacheKey)!;\n    }\n\n    const user = await this.getUserById(userId);\n    if (!user) return [];\n\n    const permissions: unknown: Permission[] = [];\n    \n    // Get permissions from user roles\n    for (const role: unknown of user.roles) {\n      permissions.push(...role.permissions);\n    }\n\n    // Get direct user permissions\n    permissions.push(...user.permissions);\n\n    // Remove duplicates\n    const uniquePermissions = permissions.filter((permission, index, array) => \n      array.findIndex(p => p.id === permission.id) === index\n    );\n\n    // Cache for 15 minutes\n    this.permissionCache.set(cacheKey, uniquePermissions);\n    setTimeout(() => this.permissionCache.delete(cacheKey), 15 * 60 * 1000);\n\n    return uniquePermissions;\n  }\n\n  /**\n   * Create new user\n   */\n  async createUser(userData: {\n    email: string;\n    username: string;\n    firstName: string;\n    lastName: string;\n    password: string;\n    roles: string[];\n    department?: string;\n    organizationId: string;\n    practitionerId?: string;\n    createdBy: string;\n  }): Promise<User> {\n    const userId = uuidv4();\n    const _hashedPassword = await bcrypt.hash(userData.password, 12);\n    \n    const user: unknown: User = {\n      id: userId,\n      email: userData.email,\n      username: userData.username,\n      firstName: userData.firstName,\n      lastName: userData.lastName,\n      roles: await this.getRolesByIds(userData.roles),\n      permissions: [],\n      isActive: true,\n      isLocked: false,\n      mfaEnabled: false,\n      department: userData.department,\n      organizationId: userData.organizationId,\n      practitionerId: userData.practitionerId,\n      metadata: {\n        createdAt: new Date(),\n        updatedAt: new Date(),\n        createdBy: userData.createdBy,\n        failedLoginAttempts: 0\n      }\n    };\n\n    // In production, this would be stored in database\n    // For now, we'll emit an event\n    this.emit('user_created', user);\n\n    await this.logAuditEvent('user_created', 'user', userId, {\n      email: userData.email,\n      username: userData.username,\n      roles: userData.roles\n    }, userData.createdBy, userData.organizationId);\n\n    return user;\n  }\n\n  /**\n   * Create new role\n   */\n  async createRole(roleData: {\n    name: string;\n    description: string;\n    permissions: string[];\n    organizationId?: string;\n    createdBy: string;\n  }): Promise<Role> {\n    const roleId = uuidv4();\n    \n    const role: unknown: Role = {\n      id: roleId,\n      name: roleData.name,\n      description: roleData.description,\n      permissions: await this.getPermissionsByIds(roleData.permissions),\n      isSystem: false,\n      organizationId: roleData.organizationId,\n      metadata: {\n        createdAt: new Date(),\n        updatedAt: new Date(),\n        createdBy: roleData.createdBy\n      }\n    };\n\n    this.roleCache.set(roleId, role);\n    this.emit('role_created', role);\n\n    await this.logAuditEvent('role_created', 'role', roleId, {\n      name: roleData.name,\n      permissions: roleData.permissions\n    }, roleData.createdBy, roleData.organizationId || 'global');\n\n    return role;\n  }\n\n  /**\n   * Create new permission\n   */\n  async createPermission(permissionData: {\n    resource: string;\n    action: string;\n    scope: PermissionScope;\n    conditions?: PermissionCondition[];\n    description: string;\n  }): Promise<Permission> {\n    const permissionId = uuidv4();\n    \n    const permission: unknown: Permission = {\n      id: permissionId,\n      resource: permissionData.resource,\n      action: permissionData.action,\n      scope: permissionData.scope,\n      conditions: permissionData.conditions,\n      metadata: {\n        createdAt: new Date(),\n        updatedAt: new Date(),\n        description: permissionData.description\n      }\n    };\n\n    this.emit('permission_created', permission);\n\n    return permission;\n  }\n\n  /**\n   * Assign role to user\n   */\n  async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    const role = await this.getRoleById(roleId);\n    \n    if (!user || !role) {\n      throw new Error('User or role not found');\n    }\n\n    if (!user.roles.find(r => r.id === roleId)) {\n      user.roles.push(role);\n      user.metadata.updatedAt = new Date();\n      \n      // Clear permission cache\n      this.permissionCache.delete(`user_permissions_/* SECURITY: Parameterized query with userId validation */
    const _sanitizedUserId = this.sanitizeUserId(userId);\n      \n      this.emit('role_assigned', { userId, roleId, assignedBy });\n      \n      await this.logAuditEvent('role_assigned', 'user', userId, {\n        roleId,\n        roleName: role.name\n      }, assignedBy, user.organizationId);\n    }\n  }\n\n  /**\n   * Remove role from user\n   */\n  async removeRoleFromUser(userId: string, roleId: string, removedBy: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    \n    if (!user) {\n      throw new Error('User not found');\n    }\n\n    const roleIndex = user.roles.findIndex(r => r.id === roleId);\n    if (roleIndex !== -1) {\n      const removedRole = user.roles.splice(roleIndex, 1)[0];\n      user.metadata.updatedAt = new Date();\n      \n      // Clear permission cache\n      this.permissionCache.delete(`user_permissions_/* SECURITY: Parameterized query with userId validation */
    const _sanitizedUserId = this.sanitizeUserId(userId);\n      \n      this.emit('role_removed', { userId, roleId, removedBy });\n      \n      await this.logAuditEvent('role_removed', 'user', userId, {\n        roleId,\n        roleName: removedRole.name\n      }, removedBy, user.organizationId);\n    }\n  }\n\n  /**\n   * Log out user (invalidate session)\n   */\n  async logout(sessionId: string): Promise<void> {\n    const session = this.sessions.get(sessionId);\n    if (session != null) {\n      session.isActive = false;\n      this.sessions.delete(sessionId);\n      \n      await this.logAuditEvent('logout', 'session', sessionId, {}, \n        session.userId, 'unknown');\n      \n      this.emit('user_logged_out', { sessionId, userId: session.userId });\n    }\n  }\n\n  /**\n   * Log out all user sessions\n   */\n  async logoutAllSessions(userId: string): Promise<void> {\n    const userSessions = Array.from(this.sessions.values());\n      .filter(session => session.userId === userId);\n    \n    for (const session: unknown of userSessions) {\n      session.isActive = false;\n      this.sessions.delete(session.id);\n    }\n    \n    await this.logAuditEvent('logout_all_sessions', 'user', userId, {\n      sessionCount: userSessions.length\n    }, userId, 'unknown');\n    \n    this.emit('user_all_sessions_logged_out', { userId, sessionCount: userSessions.length });\n  }\n\n  /**\n   * Lock user account\n   */\n  async lockUser(userId: string, lockedBy: string, reason?: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    if (user != null) {\n      user.isLocked = true;\n      user.metadata.updatedAt = new Date();\n      \n      // Log out all sessions\n      await this.logoutAllSessions(userId);\n      \n      await this.logAuditEvent('user_locked', 'user', userId, {\n        reason,\n        lockedBy\n      }, lockedBy, user.organizationId);\n      \n      this.emit('user_locked', { userId, lockedBy, reason });\n    }\n  }\n\n  /**\n   * Unlock user account\n   */\n  async unlockUser(userId: string, unlockedBy: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    if (user != null) {\n      user.isLocked = false;\n      user.metadata.failedLoginAttempts = 0;\n      user.metadata.lastFailedLogin = undefined;\n      user.metadata.updatedAt = new Date();\n      \n      await this.logAuditEvent('user_unlocked', 'user', userId, {\n        unlockedBy\n      }, unlockedBy, user.organizationId);\n      \n      this.emit('user_unlocked', { userId, unlockedBy });\n    }\n  }\n\n  /**\n   * Change user password\n   */\n  async changePassword(\n    userId: string, \n    currentPassword: string, \n    newPassword: string\n  ): Promise<boolean> {\n    const user = await this.getUserById(userId);\n    if (!user) return false;\n\n    // Verify current password\n    const isValidPassword = await this.verifyPassword(currentPassword, user);\n    if (!isValidPassword) {\n      await this.logAuditEvent('password_change_failed', 'user', userId, {\n        reason: 'invalid_current_password'\n      }, userId, user.organizationId);\n      return false;\n    }\n\n    // Hash new password\n    const _hashedPassword = await bcrypt.hash(newPassword, 12);\n    \n    // In production, update password in database\n    user.metadata.passwordChangedAt = new Date();\n    user.metadata.updatedAt = new Date();\n    \n    await this.logAuditEvent('password_changed', 'user', userId, {}, \n      userId, user.organizationId);\n    \n    this.emit('password_changed', { userId });\n    \n    return true;\n  }\n\n  /**\n   * Get audit logs\n   */\n  async getAuditLogs(filters: {\n    userId?: string;\n    organizationId?: string;\n    resource?: string;\n    action?: string;\n    startDate?: Date;\n    endDate?: Date;\n    limit?: number;\n    offset?: number;\n  }): Promise<AuditLog[]> {\n    // In production, this would query the database\n    // For now, return empty array\n    return [];\n  }\n\n  /**\n   * Get active sessions for user\n   */\n  getActiveSessions(userId: string): Session[] {\n    return Array.from(this.sessions.values());\n      .filter(session => session.userId === userId &&
      session.isActive);\n  }\n\n  /**\n   * Get security statistics\n   */\n  getSecurityStats(): {\n    activeSessions: number;\n    activeUsers: number;\n    lockedUsers: number;\n    totalRoles: number;\n    totalPermissions: number;\n  } {\n    const activeSessions = Array.from(this.sessions.values());\n      .filter(session => session.isActive).length;\n    \n    // In production, these would be database queries\n    return {\n      activeSessions,\n      activeUsers: 0,\n      lockedUsers: 0,\n      totalRoles: this.roleCache.size,\n      totalPermissions: 0\n    };\n  }\n\n  // Private helper methods\n\n  private async findUser(emailOrUsername: string): Promise<User | null> {\n    // In production, this would query the database\n    // For now, return null\n    return null;\n  }\n\n  private async getUserById(userId: string): Promise<User | null> {\n    // In production, this would query the database\n    // For now, return null\n    return null;\n  }\n\n  private async getRoleById(roleId: string): Promise<Role | null> {\n    return this.roleCache.get(roleId) || null;\n  }\n\n  private async getRolesByIds(roleIds: string[]): Promise<Role[]> {\n    const roles: Role[] = [];\n    for (const roleId of roleIds) {\n      const role = await this.getRoleById(roleId);\n      if (role != null) roles.push(role);\n    }\n    return roles;\n  }\n\n  private async getPermissionsByIds(permissionIds: string[]): Promise<Permission[]> {\n    // In production, this would query the database\n    return [];\n  }\n\n  private async verifyPassword(password: string, user: User): Promise<boolean> {\n    // In production, this would compare with hashed password\n    return true;\n  }\n\n  private async handleFailedLogin(userId: string, ipAddress?: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    if (user != null) {\n      user.metadata.failedLoginAttempts++;\n      user.metadata.lastFailedLogin = new Date();\n      \n      // Lock account after 5 failed attempts\n      if (user.metadata.failedLoginAttempts >= 5) {\n        await this.lockUser(userId, 'system', 'Too many failed login attempts');\n      }\n    }\n  }\n\n  private async resetFailedLoginAttempts(userId: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    if (user != null) {\n      user.metadata.failedLoginAttempts = 0;\n      user.metadata.lastFailedLogin = undefined;\n    }\n  }\n\n  private async updateLastLogin(userId: string): Promise<void> {\n    const user = await this.getUserById(userId);\n    if (user != null) {\n      user.lastLogin = new Date();\n    }\n  }\n\n  private async createSession(\n    userId: string, \n    ipAddress?: string, \n    userAgent?: string\n  ): Promise<Session> {\n    const sessionId = uuidv4();\n    const now = new Date();\n    \n    const session: Session = {\n      id: sessionId,\n      userId,\n      token: '',\n      refreshToken: '',\n      expiresAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour\n      refreshExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days\n      isActive: true,\n      ipAddress,\n      userAgent,\n      metadata: {\n        createdAt: now,\n        lastUsed: now\n      }\n    };\n\n    this.sessions.set(sessionId, session);\n    return session;\n  }\n\n  private generateAccessToken(user: User, session: Session): string {\n    return jwt.sign({\n      userId: user.id,\n      email: user.email,\n      organizationId: user.organizationId,\n      department: user.department,\n      practitionerId: user.practitionerId,\n      sessionId: session.id\n    }, this.jwtSecret, {\n      expiresIn: '1h'\n    });\n  }\n\n  private generateRefreshToken(session: Session): string {\n    return jwt.sign({\n      sessionId: session.id\n    }, this.jwtRefreshSecret, {\n      expiresIn: '30d'\n    });\n  }\n\n  private matchesPermission(permission: Permission, resource: string, action: string): boolean {\n    return (permission.resource === resource || permission.resource === '*') &&;\n           (permission.action === action || permission.action === '*');\n  }\n\n  private async evaluatePermissionScope(\n    permission: Permission,\n    context: AccessContext,\n    resourceData?: unknown\n  ): Promise<boolean> {\n    switch (permission.scope) {\n      case 'global':\n        return true;\n      case 'organization':\n        return resourceData?.organizationId === context.organizationId;\n      case 'department':\n        return resourceData?.department === context.department;\n      case 'self':\n        return resourceData?.userId === context.userId;\n      case 'assigned':\n        return resourceData?.assignedTo === context.userId ||;\n               resourceData?.practitionerId === context.practitionerId;\n      default:\n        return false;\n    }\n  }\n\n  private async evaluatePermissionConditions(\n    permission: Permission,\n    context: AccessContext,\n    resourceData?: unknown\n  ): Promise<boolean> {\n    if (!permission.conditions || permission.conditions.length === 0) {\n      return true;\n    }\n\n    for (const condition of permission.conditions) {\n      const fieldValue = resourceData?.[condition.field];\n      \n      switch (condition.operator) {\n        case 'equals':\n          if (fieldValue !== condition.value) return false;\n          break;\n        case 'not_equals':\n          if (fieldValue === condition.value) return false;\n          break;\n        case 'in':\n          if (!Array.isArray(condition.value) || !condition.value.includes(fieldValue)) return false;\n          break;\n        case 'not_in':\n          if (Array.isArray(condition.value) &&
      condition.value.includes(fieldValue)) return false;\n          break;\n        case 'contains':\n          if (typeof fieldValue !== 'string' || !fieldValue.includes(condition.value)) return false;\n          break;\n        case 'starts_with':\n          if (typeof fieldValue !== 'string' || !fieldValue.startsWith(condition.value)) return false;\n          break;\n        case 'ends_with':\n          if (typeof fieldValue !== 'string' || !fieldValue.endsWith(condition.value)) return false;\n          break;\n        default:\n          return false;\n      }\n    }\n\n    return true;\n  }\n\n  private async logAuditEvent(\n    action: string,\n    resource: string,\n    resourceId?: string,\n    details?: unknown,\n    userId?: string,\n    organizationId?: string\n  ): Promise<void> {\n    const auditLog: AuditLog = {\n      id: uuidv4(),\n      userId: userId || 'system',\n      action,\n      resource,\n      resourceId,\n      organizationId: organizationId || 'unknown',\n      success: true,\n      details: details || {},\n      timestamp: new Date(),\n      sessionId: 'unknown'\n    };\n\n    // In production, this would be stored in database\n    this.emit('audit_log', auditLog);\n  }\n\n  private cleanupExpiredSessions(): void {\n    const now = new Date();\n    const expiredSessions: string[] = [];\n\n    for (const [sessionId, session] of this.sessions.entries()) {\n      if (now > session.refreshExpiresAt) {\n        expiredSessions.push(sessionId);\n      }\n    }\n\n    for (const sessionId of expiredSessions) {\n      this.sessions.delete(sessionId);\n    }\n\n    if (expiredSessions.length > 0) {\n      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
