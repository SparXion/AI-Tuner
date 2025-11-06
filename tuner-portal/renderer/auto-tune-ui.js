/**
 * Auto-Tune UI Component
 * Handles Auto-Tune detection and UI interactions
 */

class AutoTuneUI {
    constructor() {
        this.mode = 'auto';
        this.detectionSuggestion = null;
        this.init();
    }

    async init() {
        if (!window.electronAPI) {
            setTimeout(() => this.init(), 100);
            return;
        }

        // Get current mode
        this.mode = await window.electronAPI.autoTune.getMode();
        this.updateModeUI();

        // Set up event listeners
        this.setupEventListeners();

        // Monitor unified input for auto-detection
        this.setupInputMonitoring();
    }

    setupEventListeners() {
        // Mode toggle
        const modeToggle = document.getElementById('auto-tune-mode-toggle');
        if (modeToggle) {
            modeToggle.addEventListener('change', (e) => {
                this.setMode(e.target.checked ? 'auto' : 'manual');
            });
        }

        // Suggestion buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'auto-tune-accept') {
                this.acceptSuggestion();
            } else if (e.target.id === 'auto-tune-dismiss') {
                this.dismissSuggestion();
            }
        });
    }

    setupInputMonitoring() {
        const unifiedInput = document.getElementById('unified-input');
        if (!unifiedInput) return;

        let debounceTimer;
        unifiedInput.addEventListener('input', (e) => {
            if (this.mode !== 'auto') return;

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.detectContext(e.target.value);
            }, 500); // Wait 500ms after user stops typing
        });
    }

    async detectContext(input) {
        if (!input || input.trim().length < 3) {
            return;
        }

        try {
            const detection = await window.electronAPI.autoTune.detect(input);
            if (detection && detection.confidence > 0.5) {
                this.showSuggestion(detection);
            }
        } catch (error) {
            console.error('Auto-Tune detection error:', error);
        }
    }

    showSuggestion(detection) {
        this.detectionSuggestion = detection;

        // Create or update suggestion UI
        let suggestionBox = document.getElementById('auto-tune-suggestion');
        if (!suggestionBox) {
            suggestionBox = document.createElement('div');
            suggestionBox.id = 'auto-tune-suggestion';
            suggestionBox.className = 'auto-tune-suggestion';
            
            const unifiedInput = document.getElementById('unified-input');
            if (unifiedInput && unifiedInput.parentElement) {
                unifiedInput.parentElement.insertBefore(suggestionBox, unifiedInput);
            }
        }

        suggestionBox.innerHTML = `
            <div class="auto-tune-suggestion-content">
                <div class="auto-tune-suggestion-icon">🎯</div>
                <div class="auto-tune-suggestion-text">
                    <strong>Detected: ${detection.discipline}</strong>
                    <span>Confidence: ${Math.round(detection.confidence * 100)}%</span>
                    <span>Suggested: ${detection.suggestedPreset}</span>
                </div>
                <div class="auto-tune-suggestion-actions">
                    <button id="auto-tune-accept" class="auto-tune-btn accept">Yes</button>
                    <button id="auto-tune-dismiss" class="auto-tune-btn dismiss">No</button>
                </div>
            </div>
        `;

        suggestionBox.style.display = 'block';
    }

    async acceptSuggestion() {
        if (!this.detectionSuggestion) return;

        const detection = this.detectionSuggestion;

        // Apply suggested preset/persona/levers
        if (window.tunerIntegration && window.tunerIntegration.aiTuner) {
            // Apply persona
            if (detection.suggestedPersona) {
                window.tunerIntegration.aiTuner.selectPersona(detection.suggestedPersona);
            }

            // Apply levers
            if (detection.suggestedLevers) {
                Object.keys(detection.suggestedLevers).forEach(leverKey => {
                    const value = detection.suggestedLevers[leverKey];
                    window.tunerIntegration.aiTuner.levers[leverKey] = value;
                    const slider = document.getElementById(`lever-${leverKey}`);
                    if (slider) {
                        slider.value = value;
                        const valueDisplay = document.getElementById(`lever-value-${leverKey}`);
                        if (valueDisplay) {
                            valueDisplay.textContent = value;
                        }
                    }
                });
            }

            // Regenerate prompt
            window.tunerIntegration.aiTuner.generatePrompt();
            window.tunerIntegration.updatePrompt();
        }

        this.dismissSuggestion();
    }

    dismissSuggestion() {
        const suggestionBox = document.getElementById('auto-tune-suggestion');
        if (suggestionBox) {
            suggestionBox.style.display = 'none';
        }
        this.detectionSuggestion = null;
    }

    async setMode(mode) {
        this.mode = mode;
        if (window.electronAPI) {
            window.electronAPI.autoTune.setMode(mode);
        }
        this.updateModeUI();
    }

    updateModeUI() {
        const modeToggle = document.getElementById('auto-tune-mode-toggle');
        if (modeToggle) {
            modeToggle.checked = this.mode === 'auto';
        }

        const modeLabel = document.getElementById('auto-tune-mode-label');
        if (modeLabel) {
            modeLabel.textContent = this.mode === 'auto' ? 'Auto' : 'Manual';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.autoTuneUI = new AutoTuneUI();
    });
} else {
    window.autoTuneUI = new AutoTuneUI();
}

