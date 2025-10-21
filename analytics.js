/*
 * Copyright 2025 John Violette
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// AI Tuner - Analytics and Usage Tracking

class AITunerAnalytics {
    constructor() {
        this.consentGiven = localStorage.getItem('ai_tuner_analytics_consent') === 'true';
        this.sessionId = this.generateSessionId();
        this.events = [];
        this.init();
    }

    init() {
        if (!this.consentGiven) {
            this.showConsentDialog();
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showConsentDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'analytics-consent-dialog';
        dialog.innerHTML = `
            <div class="consent-overlay">
                <div class="consent-dialog">
                    <h3>Help Improve AI Tuner</h3>
                    <p>We'd like to collect anonymous usage data to understand how people use AI Tuner and improve the tool. This helps us:</p>
                    <ul>
                        <li>See which features are most popular</li>
                        <li>Understand how people customize AI responses</li>
                        <li>Improve the user experience</li>
                        <li>Add features people actually want</li>
                    </ul>
                    <p><strong>What we collect:</strong> Anonymous usage patterns, feature usage, and configuration preferences. No personal information, no prompts, no identifiable data.</p>
                    <div class="consent-buttons">
                        <button id="consent-accept" class="btn btn-primary">Yes, help improve AI Tuner</button>
                        <button id="consent-decline" class="btn btn-secondary">No thanks</button>
                    </div>
                    <p class="consent-note">You can change this preference anytime in settings.</p>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        document.getElementById('consent-accept').addEventListener('click', () => {
            this.giveConsent(true);
            this.removeDialog();
        });
        
        document.getElementById('consent-decline').addEventListener('click', () => {
            this.giveConsent(false);
            this.removeDialog();
        });
    }

    giveConsent(consent) {
        this.consentGiven = consent;
        localStorage.setItem('ai_tuner_analytics_consent', consent.toString());
        if (consent) {
            this.track('consent_given');
        }
    }

    removeDialog() {
        const dialog = document.getElementById('analytics-consent-dialog');
        if (dialog) {
            dialog.remove();
        }
    }

    track(eventName, data = {}) {
        if (!this.consentGiven) return;

        const event = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            event: eventName,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.events.push(event);
        this.sendEvent(event);
    }

    sendEvent(event) {
        // Send to your analytics endpoint
        // For now, we'll store locally and you can implement your backend
        try {
            // Store in localStorage for now (you can implement proper backend later)
            const storedEvents = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
            storedEvents.push(event);
            localStorage.setItem('ai_tuner_events', JSON.stringify(storedEvents.slice(-100))); // Keep last 100 events
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }

    // Specific tracking methods
    trackPresetUsed(presetName) {
        this.track('preset_used', { preset: presetName });
    }

    trackSettingChanged(category, setting, value) {
        this.track('setting_changed', { 
            category: category, 
            setting: setting, 
            value: value 
        });
    }

    trackPromptGenerated(settings) {
        this.track('prompt_generated', { 
            personality: settings.personality,
            bluntness: settings.bluntness,
            elementElimination: settings.elementElimination,
            sentimentBoost: settings.sentimentBoost
        });
    }

    trackDownload(type) {
        this.track('download', { type: type });
    }

    trackUpload() {
        this.track('upload');
    }

    trackInfoButtonClicked(category) {
        this.track('info_clicked', { category: category });
    }

    // Export data for analysis
    exportData() {
        const events = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
        const dataStr = JSON.stringify(events, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai_tuner_analytics_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get analytics summary
    getSummary() {
        const events = JSON.parse(localStorage.getItem('ai_tuner_events') || '[]');
        const summary = {
            totalEvents: events.length,
            uniqueSessions: new Set(events.map(e => e.sessionId)).size,
            presetUsage: {},
            settingChanges: {},
            downloads: 0,
            uploads: 0
        };

        events.forEach(event => {
            switch (event.event) {
                case 'preset_used':
                    summary.presetUsage[event.data.preset] = (summary.presetUsage[event.data.preset] || 0) + 1;
                    break;
                case 'setting_changed':
                    const key = `${event.data.category}.${event.data.setting}`;
                    summary.settingChanges[key] = (summary.settingChanges[key] || 0) + 1;
                    break;
                case 'download':
                    summary.downloads++;
                    break;
                case 'upload':
                    summary.uploads++;
                    break;
            }
        });

        return summary;
    }
}

// Initialize analytics
window.aiTunerAnalytics = new AITunerAnalytics();
