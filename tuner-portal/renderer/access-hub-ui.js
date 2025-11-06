/**
 * Access Hub UI Component
 * Manages service logins, subscriptions, and credentials
 */

class AccessHubUI {
    constructor() {
        this.services = [];
        this.subscriptions = [];
        this.auditLog = [];
        this.vaultUnlocked = false;
        this.init();
    }

    async init() {
        if (!window.electronAPI) {
            setTimeout(() => this.init(), 100);
            return;
        }

        // Check vault status
        const isInitialized = await window.electronAPI.vault.isInitialized();
        if (!isInitialized) {
            this.showVaultSetup();
        } else {
            const isUnlocked = await window.electronAPI.vault.isUnlocked();
            if (!isUnlocked) {
                this.showVaultUnlock();
            } else {
                this.vaultUnlocked = true;
                this.loadData();
            }
        }

        this.setupEventListeners();
    }

    async loadData() {
        // Load services
        this.services = await window.electronAPI.accessHub.getServices();
        
        // Load subscriptions
        this.subscriptions = await window.electronAPI.accessHub.getAllSubscriptions();
        
        // Load audit log
        this.auditLog = await window.electronAPI.accessHub.getAuditLog();

        this.renderServices();
        this.renderSubscriptions();
        this.renderAuditLog();
    }

    setupEventListeners() {
        // Vault setup/unlock
        document.addEventListener('submit', async (e) => {
            if (e.target.id === 'vault-setup-form') {
                e.preventDefault();
                await this.handleVaultSetup(e);
            } else if (e.target.id === 'vault-unlock-form') {
                e.preventDefault();
                await this.handleVaultUnlock(e);
            }
        });

        // Service login
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('service-login-btn')) {
                const serviceId = e.target.dataset.service;
                await this.showLoginDialog(serviceId);
            } else if (e.target.classList.contains('service-logout-btn')) {
                const serviceId = e.target.dataset.service;
                await this.handleLogout(serviceId);
            }
        });

        // Subscription management
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('auto-renew-toggle')) {
                const serviceId = e.target.dataset.service;
                const enabled = e.target.checked;
                window.electronAPI.accessHub.toggleAutoRenew(serviceId, enabled);
            }
        });
    }

    showVaultSetup() {
        const accessHubPanel = document.getElementById('access-hub-panel');
        if (!accessHubPanel) return;

        accessHubPanel.innerHTML = `
            <div class="vault-setup">
                <h3>🔒 Security Vault Setup</h3>
                <p>Create a master password to encrypt your credentials.</p>
                <form id="vault-setup-form">
                    <input type="password" id="vault-password" placeholder="Master Password" required>
                    <input type="password" id="vault-password-confirm" placeholder="Confirm Password" required>
                    <button type="submit">Initialize Vault</button>
                </form>
            </div>
        `;
    }

    showVaultUnlock() {
        const accessHubPanel = document.getElementById('access-hub-panel');
        if (!accessHubPanel) return;

        accessHubPanel.innerHTML = `
            <div class="vault-unlock">
                <h3>🔒 Unlock Security Vault</h3>
                <form id="vault-unlock-form">
                    <input type="password" id="vault-password" placeholder="Master Password" required>
                    <button type="submit">Unlock</button>
                </form>
            </div>
        `;
    }

    async handleVaultSetup(e) {
        const password = document.getElementById('vault-password').value;
        const passwordConfirm = document.getElementById('vault-password-confirm').value;

        if (password !== passwordConfirm) {
            alert('Passwords do not match');
            return;
        }

        const success = await window.electronAPI.vault.initialize(password);
        if (success) {
            this.vaultUnlocked = true;
            this.loadData();
        } else {
            alert('Failed to initialize vault');
        }
    }

    async handleVaultUnlock(e) {
        const password = document.getElementById('vault-password').value;
        const success = await window.electronAPI.vault.unlock(password);
        if (success) {
            this.vaultUnlocked = true;
            this.loadData();
        } else {
            alert('Incorrect password');
        }
    }

    renderServices() {
        const servicesContainer = document.getElementById('services-list');
        if (!servicesContainer) return;

        servicesContainer.innerHTML = this.services.map(service => {
            const subscription = this.subscriptions.find(s => s.service === service.id);
            const hasCredentials = this.vaultUnlocked; // Check if credentials exist

            return `
                <div class="service-card" data-service="${service.id}">
                    <div class="service-header">
                        <h4>${service.name}</h4>
                        <span class="service-status ${hasCredentials ? 'connected' : 'disconnected'}">
                            ${hasCredentials ? '✓ Connected' : '○ Not Connected'}
                        </span>
                    </div>
                    ${subscription ? `
                        <div class="service-subscription">
                            <span>Plan: ${subscription.plan}</span>
                            <span>Status: ${subscription.status}</span>
                        </div>
                    ` : ''}
                    <div class="service-actions">
                        ${hasCredentials ? `
                            <button class="service-logout-btn" data-service="${service.id}">Logout</button>
                        ` : `
                            <button class="service-login-btn" data-service="${service.id}">Login</button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSubscriptions() {
        const subscriptionsContainer = document.getElementById('subscriptions-list');
        if (!subscriptionsContainer) return;

        if (this.subscriptions.length === 0) {
            subscriptionsContainer.innerHTML = '<p>No active subscriptions</p>';
            return;
        }

        subscriptionsContainer.innerHTML = this.subscriptions.map(sub => {
            return `
                <div class="subscription-card">
                    <div class="subscription-header">
                        <h4>${sub.service}</h4>
                        <span class="subscription-status ${sub.status}">${sub.status}</span>
                    </div>
                    <div class="subscription-details">
                        <span>Plan: ${sub.plan}</span>
                        ${sub.expiresAt ? `<span>Expires: ${new Date(sub.expiresAt).toLocaleDateString()}</span>` : ''}
                    </div>
                    <div class="subscription-actions">
                        <label>
                            <input type="checkbox" class="auto-renew-toggle" 
                                   data-service="${sub.service}" 
                                   ${sub.autoRenew ? 'checked' : ''}>
                            Auto-Renew
                        </label>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAuditLog() {
        const auditLogContainer = document.getElementById('audit-log-list');
        if (!auditLogContainer) return;

        if (this.auditLog.length === 0) {
            auditLogContainer.innerHTML = '<p>No audit log entries</p>';
            return;
        }

        auditLogContainer.innerHTML = this.auditLog.slice(-20).reverse().map(entry => {
            return `
                <div class="audit-log-entry">
                    <div class="audit-log-time">${new Date(entry.timestamp).toLocaleString()}</div>
                    <div class="audit-log-service">${entry.service}</div>
                    <div class="audit-log-action">${entry.action}</div>
                    <button class="audit-log-delete" data-timestamp="${entry.timestamp}">Delete</button>
                </div>
            `;
        }).join('');

        // Add delete handlers
        document.querySelectorAll('.audit-log-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const timestamp = e.target.dataset.timestamp;
                window.electronAPI.accessHub.deleteAuditEntry(timestamp);
                this.auditLog = await window.electronAPI.accessHub.getAuditLog();
                this.renderAuditLog();
            });
        });
    }

    async showLoginDialog(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;

        const dialog = document.createElement('div');
        dialog.className = 'login-dialog';
        dialog.innerHTML = `
            <div class="login-dialog-content">
                <h3>Login to ${service.name}</h3>
                <form id="login-form-${serviceId}">
                    <input type="text" id="login-username" placeholder="Username/Email" required>
                    <input type="password" id="login-password" placeholder="Password" required>
                    <input type="text" id="login-token" placeholder="API Token (optional)">
                    <div class="login-dialog-actions">
                        <button type="submit">Login</button>
                        <button type="button" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(dialog);

        // Handle form submission
        document.getElementById(`login-form-${serviceId}`).addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const token = document.getElementById('login-token').value;

            const success = await window.electronAPI.accessHub.login(serviceId, {
                username,
                password,
                token: token || undefined
            });

            if (success) {
                dialog.remove();
                this.loadData();
            } else {
                alert('Login failed');
            }
        });

        // Handle cancel
        dialog.querySelector('.cancel-btn').addEventListener('click', () => {
            dialog.remove();
        });
    }

    async handleLogout(serviceId) {
        if (confirm(`Logout from ${serviceId}?`)) {
            await window.electronAPI.vault.deleteCredential(serviceId);
            this.loadData();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.accessHubUI = new AccessHubUI();
    });
} else {
    window.accessHubUI = new AccessHubUI();
}

