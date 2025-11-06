/**
 * Tuner Portal - Main Process
 * Electron main process for the Tuner Portal desktop application
 */

import { app, BrowserWindow, BrowserView, ipcMain, session } from 'electron';
import * as path from 'path';
import Store from 'electron-store';
import { autoTuneEngine } from './auto-tune';
import { securityVault } from './security-vault';
import { accessHub } from './access-hub';
import { cursorLayer } from './cursor-layer';

const store = new Store();

// Chatbot URLs configuration
const CHATBOT_URLS = {
  chatgpt: 'https://chat.openai.com',
  claude: 'https://claude.ai',
  grok: 'https://x.com/i/grok',
  gemini: 'https://gemini.google.com',
  perplexity: 'https://www.perplexity.ai',
  mistral: 'https://chat.mistral.ai',
  llama: 'https://llama.meta.com'
};

let mainWindow: BrowserWindow | null = null;
let portalView: BrowserView | null = null;
let currentChatbot: string = 'chatgpt';
let currentSystemPrompt: string = '';

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    backgroundColor: '#1a1a1a',
    show: false
  });

  // Load the tuner interface
  const rendererPath = path.join(__dirname, '../renderer/index.html');
  console.log('Loading renderer from:', rendererPath);
  mainWindow.loadFile(rendererPath).catch(err => {
    console.error('Error loading renderer:', err);
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow?.show();
  });

  // Handle errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Create portal view for embedded chatbot
  createPortalView();

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    portalView = null;
  });

  // Handle window resize
  mainWindow.on('resize', () => {
    updatePortalBounds();
  });

  mainWindow.on('move', () => {
    updatePortalBounds();
  });
}

/**
 * Create the embedded browser view for chatbot
 */
function createPortalView() {
  if (!mainWindow) return;

  portalView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      partition: 'persist:portal'
    }
  });

  // Attach view to window
  mainWindow.setBrowserView(portalView);

  // Set view bounds (right side of window)
  updatePortalBounds();

  // Setup prompt injection
  setupPromptInjection();

  // Load initial chatbot
  const lastChatbot = store.get('lastChatbot', 'chatgpt') as string;
  loadChatbot(lastChatbot);
}

/**
 * Update portal view bounds based on window size
 */
function updatePortalBounds() {
  if (!mainWindow || !portalView) return;

  const bounds = mainWindow.getBounds();
  const tunerWidth = 400; // Fixed width for tuner panel
  const headerHeight = 60; // Height for header
  const inputHeight = 50; // Height for unified input bar

  portalView.setBounds({
    x: tunerWidth,
    y: headerHeight,
    width: bounds.width - tunerWidth,
    height: bounds.height - headerHeight - inputHeight
  });
}

/**
 * Setup prompt injection system
 */
function setupPromptInjection() {
  if (!portalView) return;

  // Intercept navigation to inject scripts
  portalView.webContents.on('did-navigate', () => {
    setTimeout(() => injectPromptScript(), 1000);
  });

  portalView.webContents.on('did-finish-load', () => {
    setTimeout(() => injectPromptScript(), 1000);
  });

  // Intercept before-send-headers to modify requests
  portalView.webContents.session.webRequest.onBeforeSendHeaders(
    {
      urls: ['*://*/*']
    },
    (details, callback) => {
      // This is a placeholder - actual injection happens via content scripts
      callback({ requestHeaders: details.requestHeaders });
    }
  );

  // Inject content script for prompt injection
  portalView.webContents.on('dom-ready', () => {
    injectPromptScript();
  });
}

/**
 * Inject the prompt injection script into the portal view
 */
function injectPromptScript() {
  if (!portalView) return;

  const injectionScript = `
    (function() {
      // Store the system prompt
      if (!window.__tunerSystemPrompt) {
        window.__tunerSystemPrompt = '';
      }
      
      // Update prompt
      window.__tunerSystemPrompt = ${JSON.stringify(currentSystemPrompt)};
      
      // Override fetch to inject system prompt
      if (!window.__tunerFetchOverridden) {
        window.__tunerFetchOverridden = true;
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          if (window.__tunerSystemPrompt && args[0] && typeof args[0] === 'string') {
            // Check if this is a message API call
            const url = args[0];
            if (url.includes('/api/') || url.includes('/chat') || url.includes('/messages') || url.includes('/conversation')) {
              // Modify request to include system prompt
              if (args[1] && args[1].body) {
                try {
                  const body = typeof args[1].body === 'string' ? JSON.parse(args[1].body) : args[1].body;
                  if (body.messages && Array.isArray(body.messages)) {
                    // Inject system prompt as first message if not present
                    const hasSystemMessage = body.messages.some(m => m.role === 'system');
                    if (!hasSystemMessage) {
                      body.messages.unshift({
                        role: 'system',
                        content: window.__tunerSystemPrompt
                      });
                    } else {
                      // Update existing system message
                      body.messages[0].content = window.__tunerSystemPrompt;
                    }
                    args[1].body = JSON.stringify(body);
                  }
                } catch (e) {
                  console.error('[Tuner Portal] Error injecting prompt:', e);
                }
              }
            }
          }
          return originalFetch.apply(this, args);
        };
      }
    })();
  `;

  portalView.webContents.executeJavaScript(injectionScript).catch(err => {
    console.error('Error injecting prompt script:', err);
  });
}

/**
 * Load a specific chatbot in the portal view
 */
function loadChatbot(chatbot: string) {
  if (!portalView || !CHATBOT_URLS[chatbot as keyof typeof CHATBOT_URLS]) {
    console.error(`Unknown chatbot: ${chatbot}`);
    return;
  }

  currentChatbot = chatbot;
  const url = CHATBOT_URLS[chatbot as keyof typeof CHATBOT_URLS];
  portalView.webContents.loadURL(url);

  // Save preference
  store.set('lastChatbot', chatbot);
}

/**
 * IPC Handlers
 */

// Handle system prompt updates from renderer
ipcMain.on('update-system-prompt', (event, prompt: string) => {
  currentSystemPrompt = prompt;
  injectPromptScript();
});

// Handle chatbot selection
ipcMain.on('select-chatbot', (event, chatbot: string) => {
  loadChatbot(chatbot);
});

// Handle window resize
ipcMain.on('window-resize', () => {
  updatePortalBounds();
});

// Get available chatbots
ipcMain.handle('get-chatbots', () => {
  return Object.keys(CHATBOT_URLS).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    url: CHATBOT_URLS[key as keyof typeof CHATBOT_URLS]
  }));
});

// Get last selected chatbot
ipcMain.handle('get-last-chatbot', () => {
  return store.get('lastChatbot', 'chatgpt');
});

// Save session
ipcMain.on('save-session', (event, sessionData: any) => {
  store.set('lastSession', sessionData);
});

// Load session
ipcMain.handle('load-session', () => {
  return store.get('lastSession', null);
});

// Auto-Tune IPC handlers
ipcMain.handle('auto-tune:detect', (event, input: string) => {
  return autoTuneEngine.detectContext(input);
});

ipcMain.handle('auto-tune:get-mode', () => {
  return autoTuneEngine.getMode();
});

ipcMain.on('auto-tune:set-mode', (event, mode: 'auto' | 'manual') => {
  autoTuneEngine.setMode(mode);
});

ipcMain.handle('auto-tune:get-history', () => {
  return autoTuneEngine.getDetectionHistory();
});

// Security Vault IPC handlers
ipcMain.handle('vault:initialize', async (event, password: string) => {
  return await securityVault.initializeVault(password);
});

ipcMain.handle('vault:unlock', async (event, password: string) => {
  return await securityVault.unlockVault(password);
});

ipcMain.on('vault:lock', () => {
  securityVault.lockVault();
});

ipcMain.handle('vault:is-initialized', () => {
  return securityVault.isInitialized();
});

ipcMain.handle('vault:is-unlocked', () => {
  return securityVault.isUnlocked();
});

ipcMain.handle('vault:store-credential', async (event, credential: any) => {
  return await securityVault.storeCredential(credential);
});

ipcMain.handle('vault:get-credential', async (event, service: string) => {
  return await securityVault.getCredential(service);
});

ipcMain.handle('vault:list-services', () => {
  return securityVault.listServices();
});

ipcMain.handle('vault:delete-credential', async (event, service: string) => {
  return await securityVault.deleteCredential(service);
});

// Access Hub IPC handlers
ipcMain.handle('access-hub:get-services', () => {
  return accessHub.getServices();
});

ipcMain.handle('access-hub:get-service', (event, serviceId: string) => {
  return accessHub.getService(serviceId);
});

ipcMain.handle('access-hub:login', async (event, serviceId: string, credentials: any) => {
  return await accessHub.loginToService(serviceId, credentials);
});

ipcMain.handle('access-hub:get-credentials', async (event, serviceId: string) => {
  return await accessHub.getStoredCredentials(serviceId);
});

ipcMain.handle('access-hub:get-subscription', (event, serviceId: string) => {
  return accessHub.getSubscription(serviceId);
});

ipcMain.handle('access-hub:get-all-subscriptions', () => {
  return accessHub.getAllSubscriptions();
});

ipcMain.on('access-hub:update-subscription', (event, serviceId: string, subscription: any) => {
  accessHub.updateSubscription(serviceId, subscription);
});

ipcMain.on('access-hub:toggle-auto-renew', (event, serviceId: string, enabled: boolean) => {
  accessHub.toggleAutoRenew(serviceId, enabled);
});

ipcMain.handle('access-hub:get-audit-log', (event, service?: string, limit?: number) => {
  return accessHub.getAuditLog(service, limit);
});

ipcMain.on('access-hub:delete-audit-entry', (event, timestamp: string) => {
  accessHub.deleteAuditLogEntry(timestamp);
});

ipcMain.on('access-hub:clear-audit-log', () => {
  accessHub.clearAuditLog();
});

// Cursor Layer IPC handlers
ipcMain.handle('cursor:get-config', () => {
  return cursorLayer.getSyncConfig();
});

ipcMain.on('cursor:set-config', (event, config: any) => {
  cursorLayer.setSyncConfig(config);
});

ipcMain.on('cursor:sync-settings', (event, settings: any) => {
  // This will be handled by cursorLayer
  cursorLayer.syncToCursor(settings);
});

ipcMain.handle('cursor:is-available', async () => {
  return await cursorLayer.isCursorAvailable();
});

// App lifecycle
app.whenReady().then(() => {
  // Initialize Cursor Layer
  cursorLayer.initialize();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

