/**
 * Tuner Portal - Preload Script
 * Bridge between main process and renderer
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // System prompt management
  updateSystemPrompt: (prompt: string) => {
    ipcRenderer.send('update-system-prompt', prompt);
  },

  // Chatbot selection
  selectChatbot: (chatbot: string) => {
    ipcRenderer.send('select-chatbot', chatbot);
  },

  // Get available chatbots
  getChatbots: () => {
    return ipcRenderer.invoke('get-chatbots');
  },

  // Get last selected chatbot
  getLastChatbot: () => {
    return ipcRenderer.invoke('get-last-chatbot');
  },

  // Session management
  saveSession: (sessionData: any) => {
    ipcRenderer.send('save-session', sessionData);
  },

  loadSession: () => {
    return ipcRenderer.invoke('load-session');
  },

  // Window management
  notifyResize: () => {
    ipcRenderer.send('window-resize');
  },

  // Auto-Tune API
  autoTune: {
    detect: (input: string) => ipcRenderer.invoke('auto-tune:detect', input),
    getMode: () => ipcRenderer.invoke('auto-tune:get-mode'),
    setMode: (mode: 'auto' | 'manual') => ipcRenderer.send('auto-tune:set-mode', mode),
    getHistory: () => ipcRenderer.invoke('auto-tune:get-history')
  },

  // Security Vault API
  vault: {
    initialize: (password: string) => ipcRenderer.invoke('vault:initialize', password),
    unlock: (password: string) => ipcRenderer.invoke('vault:unlock', password),
    lock: () => ipcRenderer.send('vault:lock'),
    isInitialized: () => ipcRenderer.invoke('vault:is-initialized'),
    isUnlocked: () => ipcRenderer.invoke('vault:is-unlocked'),
    storeCredential: (credential: any) => ipcRenderer.invoke('vault:store-credential', credential),
    getCredential: (service: string) => ipcRenderer.invoke('vault:get-credential', service),
    listServices: () => ipcRenderer.invoke('vault:list-services'),
    deleteCredential: (service: string) => ipcRenderer.invoke('vault:delete-credential', service)
  },

  // Access Hub API
  accessHub: {
    getServices: () => ipcRenderer.invoke('access-hub:get-services'),
    getService: (serviceId: string) => ipcRenderer.invoke('access-hub:get-service', serviceId),
    login: (serviceId: string, credentials: any) => ipcRenderer.invoke('access-hub:login', serviceId, credentials),
    getCredentials: (serviceId: string) => ipcRenderer.invoke('access-hub:get-credentials', serviceId),
    getSubscription: (serviceId: string) => ipcRenderer.invoke('access-hub:get-subscription', serviceId),
    getAllSubscriptions: () => ipcRenderer.invoke('access-hub:get-all-subscriptions'),
    updateSubscription: (serviceId: string, subscription: any) => ipcRenderer.send('access-hub:update-subscription', serviceId, subscription),
    toggleAutoRenew: (serviceId: string, enabled: boolean) => ipcRenderer.send('access-hub:toggle-auto-renew', serviceId, enabled),
    getAuditLog: (service?: string, limit?: number) => ipcRenderer.invoke('access-hub:get-audit-log', service, limit),
    deleteAuditEntry: (timestamp: string) => ipcRenderer.send('access-hub:delete-audit-entry', timestamp),
    clearAuditLog: () => ipcRenderer.send('access-hub:clear-audit-log')
  },

  // Cursor Layer API
  cursor: {
    getConfig: () => ipcRenderer.invoke('cursor:get-config'),
    setConfig: (config: any) => ipcRenderer.send('cursor:set-config', config),
    syncSettings: (settings: any) => ipcRenderer.send('cursor:sync-settings', settings),
    isAvailable: () => ipcRenderer.invoke('cursor:is-available')
  }
});

// Type definitions for TypeScript
declare global {
  interface Window {
    electronAPI: {
      updateSystemPrompt: (prompt: string) => void;
      selectChatbot: (chatbot: string) => void;
      getChatbots: () => Promise<Array<{ id: string; name: string; url: string }>>;
      getLastChatbot: () => Promise<string>;
      saveSession: (sessionData: any) => void;
      loadSession: () => Promise<any>;
      notifyResize: () => void;
      autoTune: {
        detect: (input: string) => Promise<any>;
        getMode: () => Promise<'auto' | 'manual'>;
        setMode: (mode: 'auto' | 'manual') => void;
        getHistory: () => Promise<any[]>;
      };
      vault: {
        initialize: (password: string) => Promise<boolean>;
        unlock: (password: string) => Promise<boolean>;
        lock: () => void;
        isInitialized: () => Promise<boolean>;
        isUnlocked: () => Promise<boolean>;
        storeCredential: (credential: any) => Promise<boolean>;
        getCredential: (service: string) => Promise<any>;
        listServices: () => Promise<string[]>;
        deleteCredential: (service: string) => Promise<boolean>;
      };
      accessHub: {
        getServices: () => Promise<any[]>;
        getService: (serviceId: string) => Promise<any>;
        login: (serviceId: string, credentials: any) => Promise<boolean>;
        getCredentials: (serviceId: string) => Promise<any>;
        getSubscription: (serviceId: string) => Promise<any>;
        getAllSubscriptions: () => Promise<any[]>;
        updateSubscription: (serviceId: string, subscription: any) => void;
        toggleAutoRenew: (serviceId: string, enabled: boolean) => void;
        getAuditLog: (service?: string, limit?: number) => Promise<any[]>;
        deleteAuditEntry: (timestamp: string) => void;
        clearAuditLog: () => void;
      };
      cursor: {
        getConfig: () => Promise<any>;
        setConfig: (config: any) => void;
        syncSettings: (settings: any) => void;
        isAvailable: () => Promise<boolean>;
      };
    };
  }
}

