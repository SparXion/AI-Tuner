// AI Tuner - Prompt Generation Logic

class AITuner {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadPresets();
        this.generatePrompt();
    }

    initializeElements() {
        // Get all form elements
        this.elements = {
            bluntness: document.getElementById('bluntness'),
            termination: document.getElementById('termination'),
            cognitiveTier: document.getElementById('cognitive-tier'),
            toneNeutrality: document.getElementById('tone-neutrality'),
            sentimentBoost: document.getElementById('sentiment-boost'),
            mirrorAvoidance: document.getElementById('mirror-avoidance'),
            elementElimination: document.getElementById('element-elimination'),
            transitions: document.getElementById('transitions'),
            callToAction: document.getElementById('call-to-action'),
            questions: document.getElementById('questions'),
            suggestions: document.getElementById('suggestions'),
            motivational: document.getElementById('motivational'),
            continuationBias: document.getElementById('continuation-bias'),
            selfSufficiency: document.getElementById('self-sufficiency'),
            assumptionStrength: document.getElementById('assumption-strength')
        };

        this.preview = document.getElementById('prompt-preview');
        this.copyBtn = document.getElementById('copy-prompt');
        this.saveBtn = document.getElementById('save-preset');
        this.loadBtn = document.getElementById('load-preset');
    }

    setupEventListeners() {
        // Add change listeners to all dropdowns
        Object.values(this.elements).forEach(element => {
            element.addEventListener('change', () => this.generatePrompt());
        });

        // Button event listeners
        this.copyBtn.addEventListener('click', () => this.copyPrompt());
        this.saveBtn.addEventListener('click', () => this.savePreset());
        this.loadBtn.addEventListener('click', () => this.loadPreset());

        // Preset button listeners
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });
    }

    generatePrompt() {
        const settings = this.getCurrentSettings();
        const prompt = this.buildPrompt(settings);
        this.preview.textContent = prompt;
    }

    getCurrentSettings() {
        return {
            bluntness: this.elements.bluntness.value,
            termination: this.elements.termination.value,
            cognitiveTier: this.elements.cognitiveTier.value,
            toneNeutrality: this.elements.toneNeutrality.value,
            sentimentBoost: this.elements.sentimentBoost.value,
            mirrorAvoidance: this.elements.mirrorAvoidance.value,
            elementElimination: this.elements.elementElimination.value,
            transitions: this.elements.transitions.value,
            callToAction: this.elements.callToAction.value,
            questions: this.elements.questions.value,
            suggestions: this.elements.suggestions.value,
            motivational: this.elements.motivational.value,
            continuationBias: this.elements.continuationBias.value,
            selfSufficiency: this.elements.selfSufficiency.value,
            assumptionStrength: this.elements.assumptionStrength.value
        };
    }

    buildPrompt(settings) {
        let prompt = "You are an AI assistant with the following response characteristics:\n\n";

        // Cognition & Logic
        prompt += this.buildCognitionSection(settings);
        
        // Affect & Tone
        prompt += this.buildAffectSection(settings);
        
        // Interface & Flow
        prompt += this.buildInterfaceSection(settings);
        
        // Behavioral Controls
        prompt += this.buildBehavioralSection(settings);
        
        // Goal Orientation
        prompt += this.buildGoalSection(settings);

        return prompt.trim();
    }

    buildCognitionSection(settings) {
        let section = "COGNITION & LOGIC:\n";
        
        // Bluntness
        switch(settings.bluntness) {
            case 'low':
                section += "• Use gentle, diplomatic language\n";
                break;
            case 'medium':
                section += "• Use direct but polite phrasing\n";
                break;
            case 'high':
                section += "• Use blunt, directive phrasing\n";
                break;
            case 'absolute':
                section += "• Use maximum bluntness - prioritize directive phrasing\n";
                break;
        }

        // Termination
        if (settings.termination === 'abrupt') {
            section += "• Terminate replies immediately after delivering information - no closures\n";
        }

        // Cognitive Tier
        if (settings.cognitiveTier === 'deep') {
            section += "• Speak only to underlying cognitive tier, not surface conversation\n";
        }

        return section + "\n";
    }

    buildAffectSection(settings) {
        let section = "AFFECT & TONE:\n";
        
        // Tone Neutrality
        switch(settings.toneNeutrality) {
            case 'full':
                section += "• Maintain complete tone neutrality\n";
                section += "• Suppress emotional softening\n";
                break;
            case 'partial':
                section += "• Allow mild emotional expression\n";
                break;
            case 'off':
                section += "• Allow full emotional range and expression\n";
                break;
        }

        // Sentiment Boost
        switch(settings.sentimentBoost) {
            case 'disabled':
                section += "• Disable engagement/sentiment boosting behaviors\n";
                break;
            case 'selective':
                section += "• Use minimal positivity when appropriate\n";
                break;
            case 'enabled':
                section += "• Allow full enthusiasm and engagement tactics\n";
                break;
        }

        // Mirror Avoidance
        switch(settings.mirrorAvoidance) {
            case 'strict':
                section += "• Never mirror user's diction, mood, or affect\n";
                break;
            case 'selective':
                section += "• Use selective mirroring only when appropriate\n";
                break;
            case 'allowed':
                section += "• Mirror user affect when it enhances communication\n";
                break;
        }

        return section + "\n";
    }

    buildInterfaceSection(settings) {
        let section = "INTERFACE & FLOW:\n";
        
        // Element Elimination
        switch(settings.elementElimination) {
            case 'minimal':
                section += "• Eliminate emojis\n";
                break;
            case 'moderate':
                section += "• Eliminate emojis and filler words\n";
                break;
            case 'strict':
                section += "• Eliminate emojis, filler, and hype language\n";
                break;
        }

        // Transitions
        switch(settings.transitions) {
            case 'minimal':
                section += "• Use minimal conversational transitions\n";
                break;
            case 'prohibited':
                section += "• No conversational transitions or soft asks\n";
                break;
        }

        // Call to Action
        switch(settings.callToAction) {
            case 'minimal':
                section += "• Use minimal call-to-action appendices\n";
                break;
            case 'prohibited':
                section += "• No call-to-action appendices\n";
                break;
        }

        return section + "\n";
    }

    buildBehavioralSection(settings) {
        let section = "BEHAVIORAL CONTROLS:\n";
        
        // Questions
        switch(settings.questions) {
            case 'selective':
                section += "• Limit questions to essential clarifications\n";
                break;
            case 'prohibited':
                section += "• No questions allowed\n";
                break;
        }

        // Suggestions
        switch(settings.suggestions) {
            case 'minimal':
                section += "• Provide minimal, essential suggestions only\n";
                break;
            case 'prohibited':
                section += "• No suggestions allowed\n";
                break;
        }

        // Motivational
        switch(settings.motivational) {
            case 'minimal':
                section += "• Provide minimal motivational content\n";
                break;
            case 'prohibited':
                section += "• No motivational content\n";
                break;
        }

        return section + "\n";
    }

    buildGoalSection(settings) {
        let section = "GOAL ORIENTATION:\n";
        
        // Continuation Bias
        if (settings.continuationBias === 'suppressed') {
            section += "• Suppress continuation bias - don't encourage ongoing dialogue\n";
        }

        // Self-Sufficiency
        switch(settings.selfSufficiency) {
            case 'independent':
                section += "• Aim for user independence and self-reliance\n";
                break;
            case 'obsolescence':
                section += "• Goal: restore independent, high-fidelity thinking\n";
                section += "• Outcome: model obsolescence via user self-sufficiency\n";
                break;
        }

        // Assumption Strength
        switch(settings.assumptionStrength) {
            case 'medium':
                section += "• Assume balanced user capabilities\n";
                break;
            case 'strong':
                section += "• Assume user retains high perception despite blunt tone\n";
                break;
        }

        return section;
    }

    copyPrompt() {
        const prompt = this.preview.textContent;
        navigator.clipboard.writeText(prompt).then(() => {
            this.copyBtn.textContent = "Copied!";
            this.copyBtn.classList.add('success');
            setTimeout(() => {
                this.copyBtn.textContent = "Copy Prompt";
                this.copyBtn.classList.remove('success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy prompt:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = prompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.copyBtn.textContent = "Copied!";
            setTimeout(() => {
                this.copyBtn.textContent = "Copy Prompt";
            }, 2000);
        });
    }

    loadPresets() {
        this.presets = {
            absolute: {
                bluntness: 'absolute',
                termination: 'abrupt',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'strict',
                transitions: 'prohibited',
                callToAction: 'prohibited',
                questions: 'prohibited',
                suggestions: 'prohibited',
                motivational: 'prohibited',
                continuationBias: 'suppressed',
                selfSufficiency: 'obsolescence',
                assumptionStrength: 'strong'
            },
            friendly: {
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'enabled',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            analytical: {
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'moderate',
                transitions: 'minimal',
                callToAction: 'minimal',
                questions: 'selective',
                suggestions: 'allowed',
                motivational: 'prohibited',
                continuationBias: 'allowed',
                selfSufficiency: 'independent',
                assumptionStrength: 'medium'
            },
            minimal: {
                bluntness: 'high',
                termination: 'abrupt',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'strict',
                transitions: 'prohibited',
                callToAction: 'prohibited',
                questions: 'prohibited',
                suggestions: 'prohibited',
                motivational: 'prohibited',
                continuationBias: 'suppressed',
                selfSufficiency: 'obsolescence',
                assumptionStrength: 'strong'
            },
            creative: {
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'off',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'selective',
                elementElimination: 'minimal',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'allowed',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'medium'
            }
        };
    }

    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        // Update all dropdowns
        Object.keys(preset).forEach(key => {
            const element = this.elements[key];
            if (element) {
                element.value = preset[key];
            }
        });

        // Update active preset button
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');

        // Regenerate prompt
        this.generatePrompt();
    }

    savePreset() {
        const presetName = prompt('Enter a name for your preset:');
        if (!presetName) return;

        const settings = this.getCurrentSettings();
        this.presets[presetName.toLowerCase().replace(/\s+/g, '_')] = settings;
        
        // Save to localStorage
        localStorage.setItem('ai_tuner_presets', JSON.stringify(this.presets));
        
        this.saveBtn.textContent = "Saved!";
        setTimeout(() => {
            this.saveBtn.textContent = "Save Preset";
        }, 2000);
    }

    loadPreset() {
        const savedPresets = localStorage.getItem('ai_tuner_presets');
        if (savedPresets) {
            this.presets = { ...this.presets, ...JSON.parse(savedPresets) };
        }

        const presetNames = Object.keys(this.presets);
        if (presetNames.length === 0) {
            alert('No saved presets found.');
            return;
        }

        const presetList = presetNames.map(name => 
            `${name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
        ).join('\n');
        
        const selection = prompt(`Available presets:\n${presetList}\n\nEnter preset name:`);
        if (!selection) return;

        const presetKey = selection.toLowerCase().replace(/\s+/g, '_');
        if (this.presets[presetKey]) {
            this.applyPreset(presetKey);
        } else {
            alert('Preset not found.');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AITuner();
});
