/**
 * Unified Access & Subscription Hub
 * Manages all AI service logins, subscriptions, and SSO
 */

import { securityVault } from './security-vault';

export interface ServiceConfig {
  id: string;
  name: string;
  url: string;
  requiresLogin: boolean;
  supportsSSO: boolean;
  subscriptionPlans?: {
    free?: boolean;
    pro?: boolean;
    team?: boolean;
    enterprise?: boolean;
  };
}

export interface SubscriptionInfo {
  service: string;
  plan: string;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: string;
  autoRenew: boolean;
  features: string[];
}

export interface AuditLogEntry {
  timestamp: string;
  service: string;
  action: string;
  details?: any;
}

export class AccessHub {
  private auditLog: AuditLogEntry[] = [];
  private subscriptions: Map<string, SubscriptionInfo> = new Map();

  // Supported services configuration
  private services: ServiceConfig[] = [
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      requiresLogin: true,
      supportsSSO: false,
      subscriptionPlans: {
        free: true,
        pro: true,
        team: true
      }
    },
    {
      id: 'claude',
      name: 'Claude',
      url: 'https://claude.ai',
      requiresLogin: true,
      supportsSSO: false,
      subscriptionPlans: {
        free: true,
        pro: true,
        team: true
      }
    },
    {
    id: 'grok',
      name: 'Grok',
      url: 'https://x.com/i/grok',
      requiresLogin: true,
      supportsSSO: true,
      subscriptionPlans: {
        free: true,
        pro: true
      }
    },
    {
      id: 'gemini',
      name: 'Gemini',
      url: 'https://gemini.google.com',
      requiresLogin: true,
      supportsSSO: true,
      subscriptionPlans: {
        free: true,
        pro: true
      }
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      url: 'https://www.perplexity.ai',
      requiresLogin: true,
      supportsSSO: false,
      subscriptionPlans: {
        free: true,
        pro: true
      }
    },
    {
      id: 'mistral',
      name: 'Mistral',
      url: 'https://chat.mistral.ai',
      requiresLogin: true,
      supportsSSO: false,
      subscriptionPlans: {
        free: true,
        pro: true
      }
    },
    {
      id: 'cursor',
      name: 'Cursor',
      url: 'cursor://',
      requiresLogin: true,
      supportsSSO: false,
      subscriptionPlans: {
        free: true,
        pro: true,
        team: true
      }
    }
  ];

  /**
   * Get all services
   */
  getServices(): ServiceConfig[] {
    return [...this.services];
  }

  /**
   * Get service by ID
   */
  getService(serviceId: string): ServiceConfig | undefined {
    return this.services.find(s => s.id === serviceId);
  }

  /**
   * Login to service
   */
  async loginToService(serviceId: string, credentials: {
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
  }): Promise<boolean> {
    try {
      // Store credentials in vault
      await securityVault.storeCredential({
        service: serviceId,
        ...credentials
      });

      // Log action
      this.logAction(serviceId, 'login', { username: credentials.username });

      return true;
    } catch (error) {
      console.error(`Error logging into ${serviceId}:`, error);
      this.logAction(serviceId, 'login_failed', { error: String(error) });
      return false;
    }
  }

  /**
   * Get stored credentials for service
   */
  async getStoredCredentials(serviceId: string): Promise<{
    username?: string;
    password?: string;
    token?: string;
    apiKey?: string;
  } | null> {
    try {
      if (!securityVault.isUnlocked()) {
        return null;
      }

      const credential = await securityVault.getCredential(serviceId);
      if (!credential) {
        return null;
      }

      return {
        username: credential.username,
        password: credential.password,
        token: credential.token,
        apiKey: credential.apiKey
      };
    } catch (error) {
      console.error(`Error getting credentials for ${serviceId}:`, error);
      return null;
    }
  }

  /**
   * Update subscription info
   */
  updateSubscription(serviceId: string, subscription: SubscriptionInfo): void {
    this.subscriptions.set(serviceId, subscription);
    this.logAction(serviceId, 'subscription_updated', subscription);
  }

  /**
   * Get subscription info
   */
  getSubscription(serviceId: string): SubscriptionInfo | undefined {
    return this.subscriptions.get(serviceId);
  }

  /**
   * Get all subscriptions
   */
  getAllSubscriptions(): SubscriptionInfo[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Toggle auto-renew
   */
  toggleAutoRenew(serviceId: string, enabled: boolean): void {
    const subscription = this.subscriptions.get(serviceId);
    if (subscription) {
      subscription.autoRenew = enabled;
      this.subscriptions.set(serviceId, subscription);
      this.logAction(serviceId, 'auto_renew_toggled', { enabled });
    }
  }

  /**
   * Log action to audit trail
   */
  private logAction(service: string, action: string, details?: any): void {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      service,
      action,
      details
    };

    this.auditLog.push(entry);

    // Keep last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog.shift();
    }
  }

  /**
   * Get audit log
   */
  getAuditLog(service?: string, limit?: number): AuditLogEntry[] {
    let log = [...this.auditLog];

    if (service) {
      log = log.filter(entry => entry.service === service);
    }

    if (limit) {
      log = log.slice(-limit);
    }

    return log;
  }

  /**
   * Delete audit log entry
   */
  deleteAuditLogEntry(timestamp: string): boolean {
    const index = this.auditLog.findIndex(entry => entry.timestamp === timestamp);
    if (index >= 0) {
      this.auditLog.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clear audit log
   */
  clearAuditLog(): void {
    this.auditLog = [];
  }

  /**
   * Check if service requires login
   */
  requiresLogin(serviceId: string): boolean {
    const service = this.getService(serviceId);
    return service?.requiresLogin ?? false;
  }

  /**
   * Check if service supports SSO
   */
  supportsSSO(serviceId: string): boolean {
    const service = this.getService(serviceId);
    return service?.supportsSSO ?? false;
  }
}

// Export singleton instance
export const accessHub = new AccessHub();

