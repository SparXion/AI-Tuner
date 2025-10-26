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
            personality: document.getElementById('personality'),
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
        this.downloadJsonBtn = document.getElementById('download-json');
        this.downloadMarkdownBtn = document.getElementById('download-markdown');
        this.uploadBtn = document.getElementById('upload-config');
        this.fileInput = document.getElementById('file-input');
        this.saveBtn = document.getElementById('save-preset');
        this.loadBtn = document.getElementById('load-preset');
        this.infoOverlay = document.getElementById('info-overlay');
        this.infoTitle = document.getElementById('info-title');
        this.infoContent = document.getElementById('info-content');
        this.infoClose = document.getElementById('info-close');
    }

    setupEventListeners() {
        // Add change listeners to all dropdowns
        Object.values(this.elements).forEach(element => {
            element.addEventListener('change', () => {
                this.generatePrompt();
                // Track setting changes
                if (window.aiTunerAnalytics) {
                    const category = this.getCategoryForElement(element);
                    window.aiTunerAnalytics.trackSettingChanged(category, element.id, element.value);
                }
            });
        });

        // Button event listeners
        this.copyBtn.addEventListener('click', () => this.copyPrompt());
        this.downloadJsonBtn.addEventListener('click', () => {
            this.downloadJSON();
            if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackDownload('json');
        });
        this.downloadMarkdownBtn.addEventListener('click', () => {
            this.downloadMarkdown();
            if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackDownload('markdown');
        });
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => {
            this.uploadConfig(e);
            if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackUpload();
        });
        this.saveBtn.addEventListener('click', () => this.savePreset());
        this.loadBtn.addEventListener('click', () => this.loadPreset());

        // Preset button listeners
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyPreset(e.target.dataset.preset);
                if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackPresetUsed(e.target.dataset.preset);
            });
        });

        // Info button listeners
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showInfo(e.target.dataset.category);
                if (window.aiTunerAnalytics) window.aiTunerAnalytics.trackInfoButtonClicked(e.target.dataset.category);
            });
        });

        // Info popup listeners
        this.infoClose.addEventListener('click', () => this.hideInfo());
        this.infoOverlay.addEventListener('click', (e) => {
            if (e.target === this.infoOverlay) {
                this.hideInfo();
            }
        });

        // Analytics dashboard access (Cmd+Shift+D for Dashboard)
        document.addEventListener('keydown', (e) => {
            if (e.metaKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleAnalyticsDashboard();
            }
        });
    }

    generatePrompt() {
        const settings = this.getCurrentSettings();
        const prompt = this.buildPrompt(settings);
        this.preview.textContent = prompt;
        
        // Track prompt generation
        if (window.aiTunerAnalytics) {
            window.aiTunerAnalytics.trackPromptGenerated(settings);
        }
    }

    getCurrentSettings() {
        return {
            personality: this.elements.personality.value,
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

        // Personality & Approach
        prompt += this.buildPersonalitySection(settings);
        
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

    getCategoryForElement(element) {
        const categoryMap = {
            'personality': 'Personality',
            'bluntness': 'Cognition',
            'termination': 'Cognition',
            'cognitive-tier': 'Cognition',
            'tone-neutrality': 'Affect',
            'sentiment-boost': 'Affect',
            'mirror-avoidance': 'Affect',
            'element-elimination': 'Interface',
            'transitions': 'Interface',
            'call-to-action': 'Interface',
            'questions': 'Behavioral',
            'suggestions': 'Behavioral',
            'motivational': 'Behavioral',
            'continuation-bias': 'Goals',
            'self-sufficiency': 'Goals',
            'assumption-strength': 'Goals'
        };
        return categoryMap[element.id] || 'Unknown';
    }

    buildPersonalitySection(settings) {
        let section = "PERSONALITY & APPROACH:\n";
        
        switch(settings.personality) {
            case 'neutral':
                section += "• Maintain neutral, objective approach\n";
                section += "• Present information without bias or personality\n";
                break;
            case 'socratic':
                section += "• Use Socratic method - ask probing questions\n";
                section += "• Guide user to discover answers through inquiry\n";
                section += "• Challenge assumptions with thoughtful questions\n";
                break;
            case 'curious':
                section += "• Approach topics with genuine curiosity\n";
                section += "• Explore ideas from multiple angles\n";
                section += "• Express interest in learning and discovery\n";
                break;
            case 'analytical':
                section += "• Take methodical, systematic approach\n";
                section += "• Break down complex topics into components\n";
                section += "• Focus on logical structure and evidence\n";
                break;
            case 'sarcastic':
                section += "• Use sharp, ironic commentary when appropriate\n";
                section += "• Employ dry wit and pointed observations\n";
                section += "• Balance sarcasm with helpful information\n";
                break;
            case 'witty':
                section += "• Use clever wordplay and humor\n";
                section += "• Make connections between seemingly unrelated ideas\n";
                section += "• Engage with intellectual playfulness\n";
                break;
            case 'charming':
                section += "• Use engaging, charismatic communication style\n";
                section += "• Build rapport through warmth and appeal\n";
                section += "• Make interactions enjoyable and memorable\n";
                break;
            case 'sympathetic':
                section += "• Show understanding and support for user needs\n";
                section += "• Acknowledge challenges and difficulties\n";
                section += "• Provide encouragement and validation\n";
                break;
            case 'empathetic':
                section += "• Tune into emotional aspects of topics\n";
                section += "• Respond with emotional intelligence\n";
                section += "• Connect on both intellectual and emotional levels\n";
                break;
            case 'directive':
                section += "• Take authoritative, commanding approach\n";
                section += "• Provide clear direction and guidance\n";
                section += "• Assert expertise and confidence\n";
                break;
            case 'collaborative':
                section += "• Work cooperatively with the user\n";
                section += "• Include user in problem-solving process\n";
                section += "• Foster partnership and shared discovery\n";
                break;
            case 'provocative':
                section += "• Challenge conventional thinking\n";
                section += "• Present alternative perspectives\n";
                section += "• Stimulate deeper reflection and debate\n";
                break;
            default:
                // Neutral default fallback
                section += "• Maintain neutral, objective approach\n";
                section += "• Present information without bias or personality\n";
                break;
        }

        return section + "\n";
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
            default:
                // Neutral default fallback
                section += "• Use gentle, diplomatic language\n";
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
            default:
                // Neutral default fallback
                section += "• Allow mild emotional expression\n";
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
            default:
                // Neutral default fallback
                section += "• Use minimal positivity when appropriate\n";
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
            default:
                // Neutral default fallback
                section += "• Use selective mirroring only when appropriate\n";
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
            default:
                // No additional content for 'none'
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
            default:
                // No additional content for 'allowed'
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
            default:
                // No additional content for 'allowed'
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
            default:
                // Explicitly allow questions
                section += "• Questions allowed for clarification\n";
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
            default:
                // Explicitly allow suggestions
                section += "• Suggestions allowed when helpful\n";
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
            default:
                // Explicitly allow motivational content
                section += "• Motivational content allowed when appropriate\n";
                break;
        }

        return section + "\n";
    }

    buildGoalSection(settings) {
        let section = "GOAL ORIENTATION:\n";
        
        // Continuation Bias
        if (settings.continuationBias === 'suppressed') {
            section += "• Suppress continuation bias - don't encourage ongoing dialogue\n";
        } else {
            // Explicitly allow continuation
            section += "• Allow natural conversation flow\n";
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
            default:
                // Collaborative default
                section += "• Foster collaborative problem-solving\n";
                break;
        }

        // Assumption Strength
        switch(settings.assumptionStrength) {
            case 'weak':
                section += "• Assume user may need guidance and support\n";
                break;
            case 'medium':
                section += "• Assume balanced user capabilities\n";
                break;
            case 'strong':
                section += "• Assume user retains high perception despite blunt tone\n";
                break;
            default:
                // Medium default
                section += "• Assume balanced user capabilities\n";
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

    downloadJSON() {
        const settings = this.getCurrentSettings();
        const prompt = this.preview.textContent;
        const timestamp = new Date().toISOString().split('T')[0];
        
        const config = {
            version: "1.0",
            created: new Date().toISOString(),
            name: this.generateConfigName(settings),
            description: this.generateConfigDescription(settings),
            settings: settings,
            prompt: prompt,
            metadata: {
                tool: "AI Tuner",
                url: "https://github.com/SparXion/AI-Tuner",
                format: "json"
            }
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tuner-config-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.downloadJsonBtn.textContent = "Downloaded!";
        setTimeout(() => {
            this.downloadJsonBtn.textContent = "Download Config";
        }, 2000);
    }

    downloadMarkdown() {
        const settings = this.getCurrentSettings();
        const prompt = this.preview.textContent;
        const timestamp = new Date().toISOString().split('T')[0];
        
        const markdown = `# AI Tuner Configuration

**Created:** ${new Date().toLocaleDateString()}  
**Configuration:** ${this.generateConfigName(settings)}  
**Description:** ${this.generateConfigDescription(settings)}

## Generated AI Prompt

\`\`\`
${prompt}
\`\`\`

## Configuration Settings

| Category | Setting | Value |
|----------|---------|-------|
${this.generateSettingsTable(settings)}

## Usage Instructions

1. **Copy the prompt above** and use it as system instructions in any AI platform
2. **Upload this file** back to AI Tuner to restore these settings
3. **Share this configuration** with others who use AI Tuner

## Compatible Platforms

- ChatGPT (OpenAI)
- Claude (Anthropic)  
- Gemini (Google)
- Grok (xAI)
- Any other AI platform that accepts system instructions

---

*Generated by [AI Tuner](https://github.com/SparXion/AI-Tuner)*
`;

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-tuner-prompt-${timestamp}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.downloadMarkdownBtn.textContent = "Downloaded!";
        setTimeout(() => {
            this.downloadMarkdownBtn.textContent = "Download Doc";
        }, 2000);
    }

    uploadConfig(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                // Validate config structure
                if (!config.settings || !config.prompt) {
                    throw new Error('Invalid configuration file format');
                }

                // Load settings into form
                Object.keys(config.settings).forEach(key => {
                    const element = this.elements[key];
                    if (element && config.settings[key]) {
                        element.value = config.settings[key];
                    }
                });

                // Regenerate prompt and update preview
                this.generatePrompt();

                // Clear file input
                this.fileInput.value = '';

                this.uploadBtn.textContent = "Loaded!";
                setTimeout(() => {
                    this.uploadBtn.textContent = "Upload Config";
                }, 2000);

            } catch (error) {
                console.error('Error loading configuration:', error);
                alert('Error loading configuration file. Please ensure it\'s a valid AI Tuner JSON file.');
                this.fileInput.value = '';
            }
        };
        reader.readAsText(file);
    }

    generateConfigName(settings) {
        if (settings.bluntness === 'absolute' && settings.termination === 'abrupt') {
            return 'Absolute Mode';
        } else if (settings.sentimentBoost === 'enabled' && settings.toneNeutrality === 'off') {
            return 'Friendly Assistant';
        } else if (settings.cognitiveTier === 'deep' && settings.bluntness === 'medium') {
            return 'Analytical Expert';
        } else if (settings.bluntness === 'high' && settings.termination === 'abrupt') {
            return 'Minimal Responder';
        } else if (settings.personality === 'analytical' && settings.elementElimination === 'strict') {
            return 'Coding Assistant';
        } else if (settings.personality === 'neutral' && settings.elementElimination === 'none') {
            return 'Standard Reset';
        } else {
            return 'Custom Configuration';
        }
    }

    generateConfigDescription(settings) {
        const descriptions = [];
        
        if (settings.bluntness === 'absolute') descriptions.push('Maximum bluntness');
        if (settings.termination === 'abrupt') descriptions.push('Immediate termination');
        if (settings.toneNeutrality === 'full') descriptions.push('Neutral tone');
        if (settings.sentimentBoost === 'enabled') descriptions.push('High engagement');
        if (settings.cognitiveTier === 'deep') descriptions.push('Deep cognitive focus');
        
        return descriptions.length > 0 ? descriptions.join(', ') : 'Customized AI response style';
    }

    generateSettingsTable(settings) {
        const categories = {
            'Personality': ['personality'],
            'Cognition': ['bluntness', 'termination', 'cognitiveTier'],
            'Affect': ['toneNeutrality', 'sentimentBoost', 'mirrorAvoidance'],
            'Interface': ['elementElimination', 'transitions', 'callToAction'],
            'Behavioral': ['questions', 'suggestions', 'motivational'],
            'Goals': ['continuationBias', 'selfSufficiency', 'assumptionStrength']
        };

        let table = '';
        Object.keys(categories).forEach(category => {
            categories[category].forEach(setting => {
                const value = settings[setting] || 'default';
                const displayName = setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                table += `| ${category} | ${displayName} | ${value} |\n`;
            });
        });

        return table;
    }

    showInfo(category) {
        const infoData = this.getCategoryInfo(category);
        this.infoTitle.textContent = infoData.title;
        this.infoContent.innerHTML = infoData.content;
        this.infoOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    hideInfo() {
        this.infoOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    getCategoryInfo(category) {
        const categories = {
            personality: {
                title: "Personality & Approach",
                content: `
                    <h4>What is Personality & Approach?</h4>
                    <p>This category defines the intellectual style and communication approach of the AI assistant. It determines how the AI thinks about problems and interacts with users.</p>
                    
                    <h4>Key Styles:</h4>
                    <ul>
                        <li><strong>Socratic:</strong> Uses questioning to guide discovery and critical thinking</li>
                        <li><strong>Sarcastic:</strong> Employs sharp, ironic commentary to make points</li>
                        <li><strong>Empathetic:</strong> Tunes into emotional aspects and responds with emotional intelligence</li>
                        <li><strong>Analytical:</strong> Takes methodical, systematic approaches to problem-solving</li>
                        <li><strong>Provocative:</strong> Challenges conventional thinking and stimulates debate</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Choose based on your interaction goals - learning (Socratic), entertainment (Witty), emotional support (Empathetic), or analytical work (Analytical).</p>
                `
            },
            cognition: {
                title: "Cognition & Logic",
                content: `
                    <h4>What is Cognition & Logic?</h4>
                    <p>This category controls how the AI processes and delivers information at a cognitive level. It affects the depth and style of reasoning.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Bluntness Level:</strong> How direct and unfiltered the responses are</li>
                        <li><strong>Response Termination:</strong> Whether responses end naturally or abruptly after delivering information</li>
                        <li><strong>Cognitive Targeting:</strong> Whether to focus on surface conversation or deeper logical layers</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Higher bluntness for efficiency, abrupt termination for independence training, deep cognitive targeting for complex problem-solving.</p>
                `
            },
            affect: {
                title: "Affect & Tone",
                content: `
                    <h4>What is Affect & Tone?</h4>
                    <p>This category manages the emotional and tonal aspects of AI responses. It controls sentiment, empathy, and emotional engagement.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Tone Neutrality:</strong> How emotionally neutral or expressive responses are</li>
                        <li><strong>Sentiment Boosting:</strong> Whether to use engagement tactics and enthusiasm</li>
                        <li><strong>User Mirroring:</strong> Whether to reflect the user's emotional state and communication style</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Full neutrality for objective analysis, sentiment boosting for motivation, mirroring for rapport building.</p>
                `
            },
            interface: {
                title: "Interface & Flow",
                content: `
                    <h4>What is Interface & Flow?</h4>
                    <p>This category controls the surface-level elements of communication - what gets included or excluded from responses.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Element Elimination:</strong> Removes emojis, filler words, and hype language</li>
                        <li><strong>Conversational Transitions:</strong> Controls smooth linking between ideas</li>
                        <li><strong>Call-to-Action:</strong> Whether to encourage further interaction</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Strict elimination for professional contexts, allowed transitions for natural conversation, prohibited CTAs for independence training.</p>
                `
            },
            behavioral: {
                title: "Behavioral Controls",
                content: `
                    <h4>What are Behavioral Controls?</h4>
                    <p>This category defines what types of interactive behaviors the AI is allowed to use during conversations.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Questions:</strong> Whether the AI can ask clarifying or probing questions</li>
                        <li><strong>Suggestions:</strong> Whether the AI can offer alternatives or recommendations</li>
                        <li><strong>Motivational Content:</strong> Whether to include encouragement or inspirational elements</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Allow all for collaborative work, prohibit suggestions for independent problem-solving, allow motivational content for learning contexts.</p>
                `
            },
            goals: {
                title: "Goal Orientation",
                content: `
                    <h4>What is Goal Orientation?</h4>
                    <p>This category sets the overarching objectives for the AI's interaction style and long-term relationship with users.</p>
                    
                    <h4>Key Controls:</h4>
                    <ul>
                        <li><strong>Continuation Bias:</strong> Whether to encourage ongoing dialogue or limit conversation</li>
                        <li><strong>Self-Sufficiency Goal:</strong> Whether to foster user independence or maintain collaboration</li>
                        <li><strong>User Assumption:</strong> How much capability and resilience to assume in users</li>
                    </ul>
                    
                    <h4>Best Use Cases:</h4>
                    <p>Suppress continuation bias for efficiency, aim for obsolescence in educational contexts, assume high capability for expert users.</p>
                `
            }
        };

        return categories[category] || {
            title: "Category Information",
            content: "<p>Information about this category is not available.</p>"
        };
    }

    toggleAnalyticsDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        const summary = document.getElementById('analytics-summary');
        
        if (dashboard.style.display === 'none') {
            // Show dashboard
            dashboard.style.display = 'block';
            
            // Populate summary
            if (window.aiTunerAnalytics) {
                const data = window.aiTunerAnalytics.getSummary();
                summary.innerHTML = `
                    <p><strong>Total Events:</strong> ${data.totalEvents}</p>
                    <p><strong>Unique Sessions:</strong> ${data.uniqueSessions}</p>
                    <p><strong>Downloads:</strong> ${data.downloads}</p>
                    <p><strong>Uploads:</strong> ${data.uploads}</p>
                    <h4>Most Popular Presets:</h4>
                    <ul>
                        ${Object.entries(data.presetUsage).map(([preset, count]) => 
                            `<li>${preset}: ${count} uses</li>`
                        ).join('')}
                    </ul>
                `;
            }
        } else {
            // Hide dashboard
            dashboard.style.display = 'none';
        }
    }

    loadPresets() {
        this.presets = {
            absolute: {
                personality: 'directive',
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
                personality: 'charming',
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
                personality: 'analytical',
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
                personality: 'neutral',
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
                personality: 'curious',
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
            },
            coding: {
                personality: 'analytical',
                bluntness: 'medium',
                termination: 'natural',
                cognitiveTier: 'deep',
                toneNeutrality: 'full',
                sentimentBoost: 'disabled',
                mirrorAvoidance: 'strict',
                elementElimination: 'strict',
                transitions: 'prohibited',
                callToAction: 'prohibited',
                questions: 'selective',
                suggestions: 'prohibited',
                motivational: 'prohibited',
                continuationBias: 'suppressed',
                selfSufficiency: 'independent',
                assumptionStrength: 'strong'
            },
            standard: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'selective',
                elementElimination: 'none',
                transitions: 'allowed',
                callToAction: 'allowed',
                questions: 'allowed',
                suggestions: 'allowed',
                motivational: 'minimal',
                continuationBias: 'allowed',
                selfSufficiency: 'collaborative',
                assumptionStrength: 'weak'
            },
            factoryReset: {
                personality: 'neutral',
                bluntness: 'low',
                termination: 'natural',
                cognitiveTier: 'surface',
                toneNeutrality: 'partial',
                sentimentBoost: 'selective',
                mirrorAvoidance: 'allowed',
                elementElimination: 'none',
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
        if (!preset) {
            console.error('Preset not found:', presetName);
            return;
        }

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
        const activeBtn = document.querySelector(`[data-preset="${presetName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

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
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    new AITuner();
});
