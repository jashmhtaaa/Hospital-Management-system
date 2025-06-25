"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/audit");
require("crypto");
var crypto = ;
const database_1 = require("@/lib/database");
/**;
 * Enterprise Field-Level Encryption Service;
 * HIPAA-compliant encryption for PHI/PII data protection;
 */ ;
;
// In production, these should come from secure key management service;
this.masterKey = this.deriveMasterKey();
this.keyId = process.env.ENCRYPTION_KEY_ID || "default";
getInstance();
EncryptionService;
{
    if (!session.user) {
        EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
}
/**;
 * Encrypt sensitive data with field-level encryption;
 */ ;
encrypt();
plaintext: string;
context ?  : EncryptionContext;
string;
{
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
if (!session.user) {
    return plaintext;
}
// Generate random IV for each encryption;
const iv = crypto.randomBytes(this.config.ivLength);
// Create cipher;
const cipher = crypto.createCipher(this.config.algorithm, this.masterKey);
cipher.setAAD(Buffer.from(this.keyId)); // Additional authenticated data;
// Encrypt data;
let encrypted = cipher.update(plaintext, "utf8", "hex");
encrypted += cipher.final("hex");
// Get authentication tag;
const tag = cipher.getAuthTag();
// Create encrypted data object;
const encrypted, iv;
("hex"),
    tag;
tag.toString("hex"),
    this.keyId,
    version;
this.version;
;
// Log encryption event for audit;
this.logEncryptionEvent("ENCRYPT", true, context);
// Return base64 encoded JSON;
return Buffer.from(JSON.stringify(encryptedData)).toString("base64");
try { }
catch (error) {
    this.logEncryptionEvent("ENCRYPT", false, context, error.message);
    throw new Error("Encryption failed");
}
/**;
 * Decrypt sensitive data;
 */ ;
decrypt();
encryptedText: string;
context ?  : EncryptionContext;
string;
{
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
if (!session.user) {
    return encryptedText;
}
// Parse encrypted data;
const encryptedData = JSON.parse();
Buffer.from(encryptedText, "base64").toString("utf8");
;
// Validate version and algorithm;
if (!session.user) {
    throw new Error("Unsupported encryption version");
}
if (!session.user) {
    throw new Error("Unsupported encryption algorithm");
}
// Create decipher;
const decipher = crypto.createDecipher();
encryptedData.algorithm,
    this.masterKey;
;
decipher.setAAD(Buffer.from(encryptedData.keyId));
decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"));
// Decrypt data;
let decrypted = decipher.update(encryptedData.data, "hex", "utf8");
decrypted += decipher.final("utf8");
// Log decryption event for audit;
this.logEncryptionEvent("DECRYPT", true, context);
return decrypted;
try { }
catch (error) {
    this.logEncryptionEvent("DECRYPT", false, context, error.message);
    throw new Error("Decryption failed");
}
/**;
 * Hash sensitive data (one-way);
 */ ;
hash(data, string, salt ?  : string);
string;
{
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
}
if (!session.user) {
    return data;
}
const saltBuffer = salt ? Buffer.from(salt, "hex") : crypto.randomBytes(16);
const hash = crypto.pbkdf2Sync();
data,
    saltBuffer,
    this.config.keyDerivationIterations,
    64,
    "sha512";
;
return saltBuffer.toString("hex") + ":" + hash.toString("hex");
try { }
catch (error) {
    throw new Error("Hashing failed");
}
/**;
 * Verify hashed data;
 */ ;
verifyHash(data, string, hashedData, string);
boolean;
{
    try {
    }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    if (!session.user) {
        return false;
        const [salt, hash] = hashedData.split(":");
        const verifyHash = crypto.pbkdf2Sync();
        data,
            Buffer.from(salt, "hex"),
            this.config.keyDerivationIterations,
            64,
            "sha512";
        ;
        return crypto.timingSafeEqual();
        Buffer.from(hash, "hex"),
            verifyHash;
        ;
    }
    try { }
    catch (error) {
        return false;
        /**;
         * Generate secure random token;
         */ ;
        generateToken(length, number = 32);
        string;
        {
            return crypto.randomBytes(length).toString("hex");
            /**;
             * Generate cryptographically secure random string;
             */ ;
            generateSecureRandom(length, number = 16);
            string;
            {
                const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                let result = "";
                for (let i = 0; i < length; i++) {
                    const randomIndex = crypto.randomInt(0, charset.length);
                    result += charset[randomIndex];
                    return result;
                    /**;
                     * Encrypt multiple fields at once;
                     */ ;
                    encryptObject();
                    obj: T,
                        fieldsToEncrypt;
                    (keyof);
                    T;
                    [];
                    context ?  : EncryptionContext;
                    T;
                    {
                        const encrypted = { ...obj };
                        for (const field of fieldsToEncrypt) {
                            const value = obj[field];
                            if (!session.user) {
                                encrypted[field] = this.encrypt(value, {
                                    ...context,
                                    resource: `${context?.resource || "object"}.${String(field)}`
                                });
                                return encrypted;
                                /**;
                                 * Decrypt multiple fields at once;
                                 */ ;
                                decryptObject();
                                obj: T,
                                    fieldsToDecrypt;
                                (keyof);
                                T;
                                [];
                                context ?  : EncryptionContext;
                                T;
                                {
                                    const decrypted = { ...obj };
                                    for (const field of fieldsToDecrypt) {
                                        const value = obj[field];
                                        if (!session.user) {
                                            try {
                                            }
                                            catch (error) {
                                                console.error(error);
                                            }
                                        }
                                        try { }
                                        catch (error) {
                                            console.error(error);
                                        }
                                    }
                                    try { }
                                    catch (error) {
                                        console.error(error);
                                    }
                                }
                                try { }
                                catch (error) {
                                    console.error(error);
                                }
                            }
                            try { }
                            catch (error) {
                                console.error(error);
                            }
                        }
                        try { }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                    try { }
                    catch (error) {
                    }
                    try { }
                    catch (error) {
                        decrypted[field] = this.decrypt(value, {
                            ...context,
                            resource: `${context?.resource || "object"}.${String(field)}`
                        });
                    }
                    try { }
                    catch (error) {
                        // Debug logging removed}:`, error);
                        // Keep encrypted value if decryption fails;
                        return decrypted;
                        /**;
                         * Key rotation - re-encrypt data with new key;
                         */ ;
                        async;
                        rotateEncryption();
                        encryptedData: string;
                        context ?  : EncryptionContext;
                        Promise < string > {
                            try: {}, catch(error) {
                                console.error(error);
                            }
                        };
                        try { }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    try { }
                    catch (error) {
                        console.error(error);
                    }
                }
                try { }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
        console.error(error);
    }
    try { }
    catch (error) {
    }
    try { }
    catch (error) {
        // Decrypt with old key;
        const plaintext = this.decrypt(encryptedData, context);
        // Re-encrypt with new key (same instance for now, but could use new key);
        const newEncrypted = this.encrypt(plaintext, context);
        await (0, database_1.logAuditEvent)({ eventType: "ENCRYPTION_KEY_ROTATION",
            context, resource } || "encrypted_data", this.keyId, context?.purpose, ipAddress, context?.ipAddress, severity, "MEDIUM");
    }
    ;
    return newEncrypted;
}
try { }
catch (error) {
    throw new Error("Key rotation failed");
    /**;
     * Data masking for display purposes;
     */ ;
    maskData(data, string, maskChar, string = "*", visibleChars, number = 4);
    string;
    {
        if (!session.user) {
            return maskChar.repeat(data?.length || 8);
            const visible = data.substring(0, visibleChars);
            const masked = maskChar.repeat(data.length - visibleChars);
            return visible + masked;
            /**;
             * Validate encryption integrity;
             */ ;
            validateIntegrity(encryptedData, string);
            boolean;
            {
                try {
                }
                catch (error) {
                    console.error(error);
                }
            }
            try { }
            catch (error) {
                console.error(error);
            }
        }
        try { }
        catch (error) {
            console.error(error);
        }
    }
    try { }
    catch (error) {
        console.error(error);
    }
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
    console.error(error);
}
try { }
catch (error) {
}
try { }
catch (error) {
    const parsed = JSON.parse();
    Buffer.from(encryptedData, "base64").toString("utf8");
    ;
    // Validate required fields;
    return !!();
    parsed?.data && ;
    parsed?.iv && ;
    parsed?.tag && ;
    parsed?.algorithm && ;
    parsed?.keyId && ;
    parsed.version;
    ;
}
try { }
catch (error) {
    return false;
    /**;
     * Private methods;
     */ ;
    deriveMasterKey();
    Buffer;
    {
        const passphrase = process.env.ENCRYPTION_PASSPHRASE || "default-passphrase";
        const salt = process.env.ENCRYPTION_SALT || "default-salt";
        return crypto.pbkdf2Sync();
        passphrase,
            salt,
            this.config.keyDerivationIterations,
            this.config.keyLength,
            "sha512";
        ;
        async;
        logEncryptionEvent();
        operation: string,
            success;
        boolean;
        context ?  : EncryptionContext,
            error ?  : string;
        Promise < void  > {
            // Only log significant events to avoid excessive logging;
            if(, session) { }, : .user
        };
        {
            await (0, database_1.logAuditEvent)({ eventType: `ENCRYPTION_${operation}`,
                userId: context?.userId,
                resource: context?.resource || "encrypted_data",
                operation,
                success,
                algorithm: this.config.algorithm,
                context, purpose,
                error,
                ipAddress: context?.ipAddress,
                severity: success ? "LOW" : "HIGH"
            });
            // Export singleton instance and utilities;
            const encrypt = (data, context) => {
                return EncryptionService.getInstance().encrypt(data, context);
            };
            exports.encrypt = encrypt;
            const decrypt = (encryptedData, context) => {
                return EncryptionService.getInstance().decrypt(encryptedData, context);
            };
            exports.decrypt = decrypt;
            const hash = (data, salt) => {
                return EncryptionService.getInstance().hash(data, salt);
            };
            exports.hash = hash;
            const verifyHash = (data, hashedData) => {
                return EncryptionService.getInstance().verifyHash(data, hashedData);
            };
            exports.verifyHash = verifyHash;
            exports.encryptionService = EncryptionService.getInstance();
            export default encryptionService;
        }
    }
}
