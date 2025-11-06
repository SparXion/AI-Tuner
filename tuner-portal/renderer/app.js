/**
 * Tuner Portal - Main App Logic
 * Handles chatbot selection, session management, and unified input
 */

class TunerPortalApp {
    constructor() {
        this.currentChatbot = 'chatgpt';
        this.init();
    }

    async init() {
        // Wait for Electron API
        if (!window.electronAPI) {
            setTimeout(() => this.init(), 100);
            return;
        }

        // Load last chatbot
        this.currentChatbot = await window.electronAPI.getLastChatbot();
        const selector = document.getElementById('chatbot-selector');
        if (selector) {
            selector.value = this.currentChatbot;
        }

        // Set up event listeners
        this.setupEventListeners();

        // Load last session if available
        this.loadLastSession();
    }

    setupEventListeners() {
        // Chatbot selector
        const chatbotSelector = document.getElementById('chatbot-selector');
        if (chatbotSelector) {
            chatbotSelector.addEventListener('change', (e) => {
                this.selectChatbot(e.target.value);
            });
        }

        // Save session button
        const saveSessionBtn = document.getElementById('save-session-btn');
        if (saveSessionBtn) {
            saveSessionBtn.addEventListener('click', () => {
                this.saveSession();
            });
        }

        // Load session button
        const loadSessionBtn = document.getElementById('load-session-btn');
        if (loadSessionBtn) {
            loadSessionBtn.addEventListener('click', () => {
                this.loadSession();
            });
        }

        // Export config button
        const exportConfigBtn = document.getElementById('export-config-btn');
        if (exportConfigBtn) {
            exportConfigBtn.addEventListener('click', () => {
                this.exportConfig();
            });
        }

        // Import config button
        const importConfigBtn = document.getElementById('import-config-btn');
        if (importConfigBtn) {
            importConfigBtn.addEventListener('click', () => {
                this.importConfig();
            });
        }

        // Access Hub button
        const accessHubBtn = document.getElementById('access-hub-btn');
        if (accessHubBtn) {
            accessHubBtn.addEventListener('click', () => {
                this.showAccessHub();
            });
        }

        // Access Hub modal close
        const accessHubClose = document.getElementById('access-hub-close');
        if (accessHubClose) {
            accessHubClose.addEventListener('click', () => {
                this.hideAccessHub();
            });
        }

        // Access Hub tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchAccessHubTab(tab);
            });
        });

        // Unified input
        const unifiedInput = document.getElementById('unified-input');
        const sendBtn = document.getElementById('send-btn');

        if (unifiedInput) {
            unifiedInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.electronAPI) {
                window.electronAPI.notifyResize();
            }
        });
    }

    selectChatbot(chatbot) {
        this.currentChatbot = chatbot;
        if (window.electronAPI) {
            window.electronAPI.selectChatbot(chatbot);
        }
    }

    async sendMessage() {
        const input = document.getElementById('unified-input');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        
        // The system prompt is already injected by the main process
        // We just need to send the message to the portal view
        // This would require IPC communication to the portal view
        // For now, we'll log it - actual implementation would need
        // to inject into the chatbot's input field via the portal view
        
        console.log('Sending message:', message);
        console.log('With system prompt:', window.tunerIntegration?.getCurrentPrompt());
        
        // Clear input
        input.value = '';
        
        // Note: Actual message sending would require:
        // 1. Access to the portal view's webContents
        // 2. Finding the chatbot's input field
        // 3. Injecting the message
        // This is complex and chatbot-specific, so it's handled in main.ts
    }

    saveSession() {
        if (!window.tunerIntegration) {
            alert('Tuner not initialized yet');
            return;
        }

        const settings = window.tunerIntegration.getSettings();
        if (!settings) {
            alert('No settings to save');
            return;
        }

        const sessionData = {
            ...settings,
            chatbot: this.currentChatbot,
            timestamp: new Date().toISOString()
        };

        if (window.electronAPI) {
            window.electronAPI.saveSession(sessionData);
            alert('Session saved!');
        }
    }

    async loadSession() {
        if (!window.electronAPI) return;

        const sessionData = await window.electronAPI.loadSession();
        if (!sessionData) {
            alert('No saved session found');
            return;
        }

        // Load chatbot
        if (sessionData.chatbot) {
            this.selectChatbot(sessionData.chatbot);
            const selector = document.getElementById('chatbot-selector');
            if (selector) {
                selector.value = sessionData.chatbot;
            }
        }

        // Load tuner settings
        if (window.tunerIntegration) {
            window.tunerIntegration.loadSettings(sessionData);
        }

        alert('Session loaded!');
    }

    async loadLastSession() {
        if (!window.electronAPI) return;

        const sessionData = await window.electronAPI.loadSession();
        if (sessionData) {
            // Auto-load last session
            if (sessionData.chatbot) {
                this.selectChatbot(sessionData.chatbot);
                const selector = document.getElementById('chatbot-selector');
                if (selector) {
                    selector.value = sessionData.chatbot;
                }
            }

            if (window.tunerIntegration) {
                window.tunerIntegration.loadSettings(sessionData);
            }
        }
    }

    exportConfig() {
        if (!window.tunerIntegration) {
            alert('Tuner not initialized yet');
            return;
        }

        const settings = window.tunerIntegration.getSettings();
        if (!settings) {
            alert('No settings to export');
            return;
        }

        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tuner-portal-config-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    if (window.tunerIntegration) {
                        window.tunerIntegration.loadSettings(settings);
                        alert('Config imported!');
                    }
                } catch (error) {
                    alert('Error importing config: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    showAccessHub() {
        const modal = document.getElementById('access-hub-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideAccessHub() {
        const modal = document.getElementById('access-hub-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    switchAccessHubTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tab}-list` || content.id === `${tab}-panel`) {
                content.classList.add('active');
            }
        });
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new TunerPortalApp();
    });
} else {
    window.app = new TunerPortalApp();
}

