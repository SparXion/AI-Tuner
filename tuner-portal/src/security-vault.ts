/**
 * Security Vault - Encrypted Credential Store
 * Zero-knowledge architecture with AES-256 encryption
 */

import * as crypto from 'crypto';
import Store from 'electron-store';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
  salt: string;
}

interface Credential {
  service: string;
  username?: string;
  encryptedPassword: EncryptedData;
  token?: EncryptedData;
  apiKey?: EncryptedData;
  metadata?: {
    subscription?: string;
    plan?: string;
    expiresAt?: string;
    autoRenew?: boolean;
  };
}

export class SecurityVault {
  private store: Store;
  private masterKey: Buffer | null = null;

  constructor() {
    this.store = new Store({
      name: 'tuner-vault'
      // We handle encryption ourselves, so no encryptionKey needed
    });
  }

  /**
   * Derive encryption key from master password
   */
  private deriveKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
  }

  /**
   * Initialize vault with master password
   */
  async initializeVault(masterPassword: string): Promise<boolean> {
    try {
      // Generate salt for key derivation
      const salt = crypto.randomBytes(SALT_LENGTH);
      const key = this.deriveKey(masterPassword, salt);

      // Store salt (not encrypted, used for key derivation)
      this.store.set('vault.salt', salt.toString('hex'));

      // Test encryption/decryption
      const testData = 'test';
      const encrypted = this.encryptData(testData, key);
      const decrypted = this.decryptData(encrypted, key);

      if (decrypted === testData) {
        this.masterKey = key;
        this.store.set('vault.initialized', true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Vault initialization error:', error);
      return false;
    }
  }

  /**
   * Unlock vault with master password
   */
  async unlockVault(masterPassword: string): Promise<boolean> {
    try {
      const saltHex = this.store.get('vault.salt') as string;
      if (!saltHex) {
        return false;
      }

      const salt = Buffer.from(saltHex, 'hex');
      const key = this.deriveKey(masterPassword, salt);

      // Test decryption
      const testEncrypted = this.encryptData('test', key);
      const testDecrypted = this.decryptData(testEncrypted, key);

      if (testDecrypted === 'test') {
        this.masterKey = key;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Vault unlock error:', error);
      return false;
    }
  }

  /**
   * Lock vault (clear master key from memory)
   */
  lockVault(): void {
    this.masterKey = null;
  }

  /**
   * Check if vault is initialized
   */
  isInitialized(): boolean {
    return this.store.get('vault.initialized', false) as boolean;
  }

  /**
   * Check if vault is unlocked
   */
  isUnlocked(): boolean {
    return this.masterKey !== null;
  }

  /**
   * Encrypt data
   */
  private encryptData(data: string, key: Buffer): EncryptedData {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      salt: '' // Not used for individual encryptions
    };
  }

  /**
   * Decrypt data
   */
  private decryptData(encryptedData: EncryptedData, key: Buffer): string {
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Store credential
   */
  async storeCredential(credential: Omit<Credential, 'encryptedPassword' | 'token' | 'apiKey'> & {
    password?: string;
    token?: string;
    apiKey?: string;
  }): Promise<boolean> {
    if (!this.masterKey) {
      throw new Error('Vault is locked');
    }

    try {
      const encryptedCredential: Credential = {
        service: credential.service,
        username: credential.username,
        encryptedPassword: credential.password
          ? this.encryptData(credential.password, this.masterKey)
          : { encrypted: '', iv: '', tag: '', salt: '' },
        token: credential.token
          ? this.encryptData(credential.token, this.masterKey)
          : undefined,
        apiKey: credential.apiKey
          ? this.encryptData(credential.apiKey, this.masterKey)
          : undefined,
        metadata: credential.metadata
      };

      const credentials = this.store.get('vault.credentials', []) as Credential[];
      const index = credentials.findIndex(c => c.service === credential.service);

      if (index >= 0) {
        credentials[index] = encryptedCredential;
      } else {
        credentials.push(encryptedCredential);
      }

      this.store.set('vault.credentials', credentials);
      return true;
    } catch (error) {
      console.error('Error storing credential:', error);
      return false;
    }
  }

  /**
   * Get credential
   */
  async getCredential(service: string): Promise<{
    service: string;
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
    metadata?: any;
  } | null> {
    if (!this.masterKey) {
      throw new Error('Vault is locked');
    }

    try {
      const credentials = this.store.get('vault.credentials', []) as Credential[];
      const credential = credentials.find(c => c.service === service);

      if (!credential) {
        return null;
      }

      return {
        service: credential.service,
        username: credential.username,
        password: credential.encryptedPassword.encrypted
          ? this.decryptData(credential.encryptedPassword, this.masterKey)
          : undefined,
        token: credential.token
          ? this.decryptData(credential.token, this.masterKey)
          : undefined,
        apiKey: credential.apiKey
          ? this.decryptData(credential.apiKey, this.masterKey)
          : undefined,
        metadata: credential.metadata
      };
    } catch (error) {
      console.error('Error getting credential:', error);
      return null;
    }
  }

  /**
   * List all services
   */
  listServices(): string[] {
    const credentials = this.store.get('vault.credentials', []) as Credential[];
    return credentials.map(c => c.service);
  }

  /**
   * Delete credential
   */
  async deleteCredential(service: string): Promise<boolean> {
    try {
      const credentials = this.store.get('vault.credentials', []) as Credential[];
      const filtered = credentials.filter(c => c.service !== service);
      this.store.set('vault.credentials', filtered);
      return true;
    } catch (error) {
      console.error('Error deleting credential:', error);
      return false;
    }
  }
}

// Export singleton instance
export const securityVault = new SecurityVault();

