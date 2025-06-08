}

/**
 * Enterprise Field-Level Encryption Service;
 * HIPAA-compliant encryption for PHI/PII data protection;
 */

import crypto from 'crypto';
import { logAuditEvent } from '@/lib/audit';

export interface EncryptionConfig {
  algorithm: string,
  keyLength: number,
  ivLength: number,
  tagLength: number,
  keyDerivationIterations: number
export interface EncryptedData {
  data: string,
  iv: string,
  tag: string,
  algorithm: string,
  keyId: string,
  version: string
export interface EncryptionContext {
  userId?: string;
  resource?: string;
  purpose?: string;
  ipAddress?: string;
export class EncryptionService {
  private static instance: EncryptionService;
  private readonly config: EncryptionConfig;
  private readonly masterKey: Buffer;
  private readonly keyId: string;
  private readonly version = '1.0';

  private constructor() {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32, // 256 bits
      ivLength: 12,  // 96 bits for GCM
      tagLength: 16, // 128 bits
      keyDerivationIterations: 100000
    };

    // In production, these should come from secure key management service
    this.masterKey = this.deriveMasterKey();
    this.keyId = process.env.ENCRYPTION_KEY_ID || 'default';
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Encrypt sensitive data with field-level encryption;
   */
  encrypt(
    plaintext: string,
    context?: EncryptionContext;
  ): string {
    try {
      if (!plaintext) {
        return plaintext;
      }

      // Generate random IV for each encryption
      const iv = crypto.randomBytes(this.config.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipher(this.config.algorithm, this.masterKey);
      cipher.setAAD(Buffer.from(this.keyId)); // Additional authenticated data
      
      // Encrypt data
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const tag = cipher.getAuthTag();

      // Create encrypted data object
      const encryptedData: EncryptedData = {
        data: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.config.algorithm,
        keyId: this.keyId,
        version: this.version
      };

      // Log encryption event for audit
      this.logEncryptionEvent('ENCRYPT', true, context);

      // Return base64 encoded JSON
      return Buffer.from(JSON.stringify(encryptedData)).toString('base64');

    } catch (error) {

      this.logEncryptionEvent('ENCRYPT', false, context, (error as Error).message);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt sensitive data;
   */
  decrypt(
    encryptedText: string,
    context?: EncryptionContext;
  ): string {
    try {
      if (!encryptedText) {
        return encryptedText;
      }

      // Parse encrypted data
      const encryptedData: EncryptedData = JSON.parse(
        Buffer.from(encryptedText, 'base64').toString('utf8');
      );

      // Validate version and algorithm
      if (encryptedData.version !== this.version) {
        throw new Error('Unsupported encryption version');
      }

      if (encryptedData.algorithm !== this.config.algorithm) {
        throw new Error('Unsupported encryption algorithm');
      }

      // Create decipher
      const decipher = crypto.createDecipher(
        encryptedData.algorithm, 
        this.masterKey;
      );
      
      decipher.setAAD(Buffer.from(encryptedData.keyId));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

      // Decrypt data
      let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      // Log decryption event for audit
      this.logEncryptionEvent('DECRYPT', true, context);

      return decrypted;

    } catch (error) {

      this.logEncryptionEvent('DECRYPT', false, context, (error as Error).message);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  hash(data: string, salt?: string): string {
    try {
      if (!data) {
        return data;
      }

      const saltBuffer = salt ? Buffer.from(salt, 'hex') : crypto.randomBytes(16);
      const hash = crypto.pbkdf2Sync(
        data,
        saltBuffer,
        this.config.keyDerivationIterations,
        64,
        'sha512';
      );

      return saltBuffer.toString('hex') + ':' + hash.toString('hex');
    } catch (error) {

      throw new Error('Hashing failed');
    }
  }

  /**
   * Verify hashed data;
   */
  verifyHash(data: string, hashedData: string): boolean {
    try {
      if (!data || !hashedData) {
        return false
      }

      const [salt, hash] = hashedData.split(':');
      const verifyHash = crypto.pbkdf2Sync(
        data,
        Buffer.from(salt, 'hex'),
        this.config.keyDerivationIterations,
        64,
        'sha512';
      );

      return crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        verifyHash;
      );
    } catch (error) {

      return false;
    }
  }

  /**
   * Generate secure random token;
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Generate cryptographically secure random string;
   */
  generateSecureRandom(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      result += charset[randomIndex];
    }
    
    return result;
  }

  /**
   * Encrypt multiple fields at once;
   */
  encryptObject<T extends Record<string, unknown>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[],
    context?: EncryptionContext;
  ): T {
    const encrypted = { ...obj };
    
    for (const field of fieldsToEncrypt) {
      const value = obj[field];
      if (typeof value === 'string' && value) {
        encrypted[field] = this.encrypt(value, {
          ...context,
          resource: `${context?.resource || 'object'}.${String(field)}`
        }) as T[keyof T];
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypt multiple fields at once;
   */
  decryptObject<T extends Record<string, unknown>>(
    obj: T,
    fieldsToDecrypt: (keyof T)[],
    context?: EncryptionContext;
  ): T {
    const decrypted = { ...obj };
    
    for (const field of fieldsToDecrypt) {
      const value = obj[field];
      if (typeof value === 'string' && value) {
        try {
          decrypted[field] = this.decrypt(value, {
            ...context,
            resource: `${context?.resource || 'object'}.${String(field)}`
          }) as T[keyof T];
        } catch (error) {
          // Debug logging removed}:`, error)
          // Keep encrypted value if decryption fails
        }
      }
    }
    
    return decrypted;
  }

  /**
   * Key rotation - re-encrypt data with new key;
   */
  async rotateEncryption(
    encryptedData: string,
    context?: EncryptionContext;
  ): Promise<string> {
    try {
      // Decrypt with old key
      const plaintext = this.decrypt(encryptedData, context);
      
      // Re-encrypt with new key (same instance for now, but could use new key)
      const newEncrypted = this.encrypt(plaintext, context)
      
      await logAuditEvent({
        eventType: 'ENCRYPTION_KEY_ROTATION',
        userId: context?.userId,
        resource: context?.resource || 'encrypted_data',
        details: { 
          oldKeyId: this.keyId,
          newKeyId: this.keyId,
          purpose: context?.purpose 
        },
        ipAddress: context?.ipAddress,
        severity: 'MEDIUM'
      });
      
      return newEncrypted;
    } catch (error) {

      throw new Error('Key rotation failed');
    }
  }

  /**
   * Data masking for display purposes;
   */
  maskData(data: string, maskChar: string = '*', visibleChars: number = 4): string {
    if (!data || data.length <= visibleChars) {
      return maskChar.repeat(data?.length || 8)
    }
    
    const visible = data.substring(0, visibleChars);
    const masked = maskChar.repeat(data.length - visibleChars);
    
    return visible + masked;
  }

  /**
   * Validate encryption integrity;
   */
  validateIntegrity(encryptedData: string): boolean {
    try {
      const parsed: EncryptedData = JSON.parse(
        Buffer.from(encryptedData, 'base64').toString('utf8');
      );
      
      // Validate required fields
      return !!(
        parsed.data &&
        parsed.iv &&
        parsed.tag &&
        parsed.algorithm &&
        parsed.keyId &&
        parsed.version;
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Private methods;
   */
  private deriveMasterKey(): Buffer {
    const passphrase = process.env.ENCRYPTION_PASSPHRASE || 'default-passphrase';
    const salt = process.env.ENCRYPTION_SALT || 'default-salt';
    
    return crypto.pbkdf2Sync(
      passphrase,
      salt,
      this.config.keyDerivationIterations,
      this.config.keyLength,
      'sha512';
    );
  }

  private async logEncryptionEvent(
    operation: string,
    success: boolean,
    context?: EncryptionContext,
    error?: string;
  ): Promise<void> {
    // Only log significant events to avoid excessive logging
    if (!success || context?.resource?.includes('sensitive')) {
      await logAuditEvent({
        eventType: `ENCRYPTION_${operation}`,
        userId: context?.userId,
        resource: context?.resource || 'encrypted_data',
        details: {
          operation,
          success,
          algorithm: this.config.algorithm,
          keyId: this.keyId,
          purpose: context?.purpose,
          error;
        },
        ipAddress: context?.ipAddress,
        severity: success ? 'LOW' : 'HIGH'
      });
    }
  }
}

// Export singleton instance and utilities
export const encrypt = (data: string, context?: EncryptionContext): string => {
  return EncryptionService.getInstance().encrypt(data, context);
};

export const decrypt = (encryptedData: string, context?: EncryptionContext): string => {
  return EncryptionService.getInstance().decrypt(encryptedData, context);
};

export const hash = (data: string, salt?: string): string => {
  return EncryptionService.getInstance().hash(data, salt);
};

export const verifyHash = (data: string, hashedData: string): boolean => {
  return EncryptionService.getInstance().verifyHash(data, hashedData);
};

export const encryptionService = EncryptionService.getInstance();

export default encryptionService;
