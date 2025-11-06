/**
 * Tuner Integration
 * Bridges the existing AI Tuner v6 engine with the Electron app
 */

class TunerIntegration {
    constructor() {
        this.aiTuner = null;
        this.currentPrompt = '';
        this.memoryMode = 'full';
        this.goal = '';
        this.outputFormat = 'raw';
        
        this.init();
    }

    async init() {
        // Wait for AI Tuner core to be available
        if (typeof window.AITunerV6 === 'undefined') {
            // Wait a bit for scripts to load
            setTimeout(() => this.init(), 100);
            return;
        }

        // Initialize AI Tuner
        this.aiTuner = new window.AITunerV6();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Generate initial prompt
        this.updatePrompt();
    }

    setupEventListeners() {
        // Mode toggle
        const modeBeginner = document.getElementById('mode-beginner');
        const modeAdvanced = document.getElementById('mode-advanced');
        
        if (modeBeginner) {
            modeBeginner.addEventListener('click', () => {
                if (this.aiTuner && this.aiTuner.mode !== 'beginner') {
                    this.aiTuner.toggleMode();
                }
            });
        }
        
        if (modeAdvanced) {
            modeAdvanced.addEventListener('click', () => {
                if (this.aiTuner && this.aiTuner.mode !== 'advanced') {
                    this.aiTuner.toggleMode();
                }
            });
        }

        // Memory mode
        const memoryRadios = document.querySelectorAll('input[name="memory-mode"]');
        memoryRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.memoryMode = e.target.value;
                this.updatePrompt();
            });
        });

        // Goal input
        const goalInput = document.getElementById('goal-input');
        if (goalInput) {
            goalInput.addEventListener('input', (e) => {
                this.goal = e.target.value;
                this.updatePrompt();
            });
        }

        // Output format
        const outputFormat = document.getElementById('output-format');
        if (outputFormat) {
            outputFormat.addEventListener('change', (e) => {
                this.outputFormat = e.target.value;
                this.updatePrompt();
            });
        }

        // Listen for prompt changes from AI Tuner
        // We'll poll the prompt preview element for changes
        const promptPreview = document.getElementById('prompt-preview');
        if (promptPreview) {
            const observer = new MutationObserver(() => {
                this.updatePrompt();
            });
            observer.observe(promptPreview, { childList: true, subtree: true });
        }
    }

    updatePrompt() {
        if (!this.aiTuner) return;

        // Build the complete system prompt
        let prompt = '';

        // Get base prompt from AI Tuner
        const basePrompt = this.aiTuner.buildPrompt();
        prompt += basePrompt;

        // Add goal if set
        if (this.goal && this.goal.trim()) {
            prompt += `\n\nGoal Lock:\n`;
            prompt += `Maintain focus on: ${this.goal}\n`;
            prompt += `All responses should align with this goal.\n`;
        }

        // Add output format instructions
        if (this.outputFormat !== 'raw') {
            prompt += `\n\nOutput Format:\n`;
            switch (this.outputFormat) {
                case 'bullet':
                    prompt += `Format responses as bullet points.\n`;
                    break;
                case 'poem':
                    prompt += `Format responses as poetry with line breaks and rhythm.\n`;
                    break;
                case 'script':
                    prompt += `Format responses as a script with dialogue and stage directions.\n`;
                    break;
                case 'markdown':
                    prompt += `Use rich markdown formatting with headers, lists, and emphasis.\n`;
                    break;
            }
        }

        // Add memory instructions
        prompt += `\n\nMemory Mode: ${this.memoryMode}\n`;
        switch (this.memoryMode) {
            case 'full':
                prompt += `Remember all context from this conversation and previous sessions.\n`;
                break;
            case 'session':
                prompt += `Remember context only from this current session.\n`;
                break;
            case 'off':
                prompt += `Do not maintain memory between messages. Treat each message independently.\n`;
                break;
        }

        this.currentPrompt = prompt;

        // Send to main process for injection
        if (window.electronAPI) {
            window.electronAPI.updateSystemPrompt(prompt);
        }

        // Update preview
        const preview = document.getElementById('prompt-preview');
        if (preview) {
            preview.textContent = prompt || 'No prompt generated yet. Select a model to begin.';
        }
    }

    getCurrentPrompt() {
        return this.currentPrompt;
    }

    getSettings() {
        if (!this.aiTuner) return null;

        return {
            model: this.aiTuner.selectedModel,
            persona: this.aiTuner.selectedPersona,
            levers: { ...this.aiTuner.levers },
            mode: this.aiTuner.mode,
            memoryMode: this.memoryMode,
            goal: this.goal,
            outputFormat: this.outputFormat,
            prompt: this.currentPrompt
        };
    }

    loadSettings(settings) {
        if (!this.aiTuner) return;

        // Load model
        if (settings.model) {
            this.aiTuner.selectModel(settings.model);
        }

        // Load persona
        if (settings.persona) {
            this.aiTuner.selectPersona(settings.persona);
        }

        // Load levers
        if (settings.levers) {
            Object.keys(settings.levers).forEach(leverKey => {
                this.aiTuner.levers[leverKey] = settings.levers[leverKey];
                const slider = document.getElementById(`lever-${leverKey}`);
                if (slider) {
                    slider.value = settings.levers[leverKey];
                    const valueDisplay = document.getElementById(`lever-value-${leverKey}`);
                    if (valueDisplay) {
                        valueDisplay.textContent = settings.levers[leverKey];
                    }
                }
            });
        }

        // Load mode
        if (settings.mode && settings.mode !== this.aiTuner.mode) {
            this.aiTuner.toggleMode();
        }

        // Load memory mode
        if (settings.memoryMode) {
            this.memoryMode = settings.memoryMode;
            const radio = document.querySelector(`input[name="memory-mode"][value="${settings.memoryMode}"]`);
            if (radio) {
                radio.checked = true;
            }
        }

        // Load goal
        if (settings.goal) {
            this.goal = settings.goal;
            const goalInput = document.getElementById('goal-input');
            if (goalInput) {
                goalInput.value = settings.goal;
            }
        }

        // Load output format
        if (settings.outputFormat) {
            this.outputFormat = settings.outputFormat;
            const outputFormatSelect = document.getElementById('output-format');
            if (outputFormatSelect) {
                outputFormatSelect.value = settings.outputFormat;
            }
        }

        // Regenerate prompt
        this.aiTuner.generatePrompt();
        this.updatePrompt();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tunerIntegration = new TunerIntegration();
    });
} else {
    window.tunerIntegration = new TunerIntegration();
}

