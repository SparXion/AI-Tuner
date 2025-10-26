/**
 * AI Tuner Extension - Enterprise Edition
 * Maintains perfect functional parity with web app while adding enterprise-grade infrastructure
 */

import * as vscode from 'vscode';
import { Logger } from './logger';
import { PerformanceMonitor } from './performanceMonitor';
import { ErrorHandler } from './errorHandler';
import { ConfigurationValidator } from './configurationValidator';
import { AITunerSettings, ExtensionConfig } from './types';

/**
 * Extension activation with enterprise-grade error handling and monitoring
 * Maintains exact functionality while adding robust infrastructure
 */
export function activate(context: vscode.ExtensionContext): void {
    const operationId = `activate_${Date.now()}`;
    
    try {
        // Initialize enterprise infrastructure
        const logger = Logger.getInstance();
        const performanceMonitor = PerformanceMonitor.getInstance();
        const errorHandler = ErrorHandler.getInstance();
        const validator = ConfigurationValidator.getInstance();

        performanceMonitor.startOperation(operationId, 'Extension Activation');
        logger.info('AI Tuner Extension activating', { operationId });

        // Register the AI Tuner view with error handling
        const provider = errorHandler.wrapSync(
            () => new AITunerProvider(context),
            'Create Provider'
        );

        if (!provider) {
            throw new Error('Failed to create AI Tuner provider');
        }

        const treeView = errorHandler.wrapSync(
            () => vscode.window.createTreeView('aiTunerPanel', {
                treeDataProvider: provider,
                showCollapseAll: true
            }),
            'Create Tree View'
        );

        if (!treeView) {
            throw new Error('Failed to create tree view');
        }

        // Register commands with error handling
        const openPanelCommand = vscode.commands.registerCommand('aiTuner.openPanel', () => {
            errorHandler.wrapSync(
                () => provider.createWebviewPanel(context),
                'Open Panel'
            );
        });

        // Register status bar item with error handling
        const statusBarItem = errorHandler.wrapSync(
            () => {
                const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
                item.text = "$(settings-gear) AI Tuner";
                item.tooltip = "AI Tuner - Click to open";
                item.command = 'aiTuner.openPanel';
                item.show();
                return item;
            },
            'Create Status Bar Item'
        );

        if (!statusBarItem) {
            throw new Error('Failed to create status bar item');
        }

        // Register all subscriptions
        context.subscriptions.push(treeView, openPanelCommand, statusBarItem);

        // Log successful activation
        performanceMonitor.endOperation(operationId, true);
        logger.info('AI Tuner Extension activated successfully', { 
            operationId,
            subscriptions: context.subscriptions.length 
        });

    } catch (error) {
        const errorHandler = ErrorHandler.getInstance();
        errorHandler.handleError(error, { 
            operation: 'Extension Activation'
        });
        
        const performanceMonitor = PerformanceMonitor.getInstance();
        performanceMonitor.endOperation(operationId, false, error instanceof Error ? error.message : 'Unknown error');
    }
}

/**
 * Extension deactivation with proper cleanup
 * Maintains exact functionality while adding proper resource management
 */
export function deactivate(): void {
    const logger = Logger.getInstance();
    const performanceMonitor = PerformanceMonitor.getInstance();
    const errorHandler = ErrorHandler.getInstance();
    const validator = ConfigurationValidator.getInstance();

    try {
        logger.info('AI Tuner Extension deactivating');
        
        // Dispose of enterprise infrastructure
        performanceMonitor.dispose();
        errorHandler.dispose();
        validator.dispose();
        logger.dispose();
        
        logger.info('AI Tuner Extension deactivated successfully');
    } catch (error) {
        console.error('Error during extension deactivation:', error);
    }
}

/**
 * AI Tuner Provider with enterprise-grade infrastructure
 * Maintains perfect functional parity with web app while adding robust error handling
 */
class AITunerProvider implements vscode.TreeDataProvider<AITunerItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AITunerItem | undefined | null | void> = new vscode.EventEmitter<AITunerItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<AITunerItem | undefined | null | void> = this._onDidChangeTreeData.event;
    
    private webviewPanel: vscode.WebviewPanel | undefined;
    
    // Enterprise infrastructure
    private logger: Logger;
    private performanceMonitor: PerformanceMonitor;
    private errorHandler: ErrorHandler;
    private validator: ConfigurationValidator;

    constructor(private context: vscode.ExtensionContext) {
        // Initialize enterprise infrastructure
        this.logger = Logger.getInstance();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.errorHandler = ErrorHandler.getInstance();
        this.validator = ConfigurationValidator.getInstance();
        
        this.logger.info('AITunerProvider initialized');
    }

    /**
     * Get tree item with error handling
     * Maintains exact functionality while adding robust error handling
     */
    getTreeItem(element: AITunerItem): vscode.TreeItem {
        try {
            return element;
        } catch (error) {
            this.errorHandler.handleError(error, { operation: 'Get Tree Item' });
            return element;
        }
    }

    /**
     * Get children with error handling and performance monitoring
     * Maintains exact functionality while adding robust infrastructure
     */
    getChildren(element?: AITunerItem): Thenable<AITunerItem[]> {
        const operationId = `getChildren_${Date.now()}`;
        
        return new Promise<AITunerItem[]>((resolve) => {
            try {
                this.performanceMonitor.startOperation(operationId, 'Get Children');
                
                if (!element) {
                    const items = [
                        new AITunerItem('Open AI Tuner', vscode.TreeItemCollapsibleState.None, {
                            command: 'aiTuner.openPanel',
                            title: 'Open AI Tuner'
                        })
                    ];
                    
                    this.performanceMonitor.endOperation(operationId, true);
                    this.logger.debug('Returned tree items', { count: items.length });
                    resolve(items);
                } else {
                    this.performanceMonitor.endOperation(operationId, true);
                    resolve([]);
                }
            } catch (error) {
                this.performanceMonitor.endOperation(operationId, false, error instanceof Error ? error.message : 'Unknown error');
                this.errorHandler.handleError(error, { operation: 'Get Children' });
                resolve([]);
            }
        });
    }

    /**
     * Create webview panel with enterprise-grade error handling and monitoring
     * Maintains exact functionality while adding robust infrastructure
     */
    createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
        const operationId = `createWebviewPanel_${Date.now()}`;
        
        return this.errorHandler.wrapSync(
            () => {
                this.performanceMonitor.startOperation(operationId, 'Create Webview Panel');
                
                try {
                    // If panel already exists, reveal it
                    if (this.webviewPanel) {
                        this.webviewPanel.reveal();
                        this.performanceMonitor.endOperation(operationId, true);
                        this.logger.debug('Revealed existing webview panel');
                        return this.webviewPanel;
                    }

                    // Create new webview panel
                    this.webviewPanel = vscode.window.createWebviewPanel(
                        'aiTuner',
                        'AI Tuner',
                        vscode.ViewColumn.One,
                        {
                            enableScripts: true,
                            retainContextWhenHidden: true
                        }
                    );

                    // Set webview content with validation
                    const webviewContent = this.getWebviewContent();
                    const sanitizedContent = this.validator.sanitizeInput(webviewContent) as string;
                    
                    this.webviewPanel.webview.html = sanitizedContent;

                    // Set up disposal handler
                    this.webviewPanel.onDidDispose(() => {
                        this.logger.debug('Webview panel disposed');
                        this.webviewPanel = undefined;
                    });

                    this.performanceMonitor.endOperation(operationId, true);
                    this.logger.info('Created new webview panel');
                    
                    return this.webviewPanel;
                } catch (error) {
                    this.performanceMonitor.endOperation(operationId, false, error instanceof Error ? error.message : 'Unknown error');
                    throw error;
                }
            },
            'Create Webview Panel'
        ) || this.webviewPanel!;
    }

    /**
     * Get webview content with enterprise-grade validation
     * Maintains exact HTML content while adding input sanitization
     */
    private getWebviewContent(): string {
        const operationId = `getWebviewContent_${Date.now()}`;
        
        return this.errorHandler.wrapSync(
            () => {
                this.performanceMonitor.startOperation(operationId, 'Get Webview Content');
                
                try {
                    const content = this.generateWebviewHTML();
                    
                    this.performanceMonitor.endOperation(operationId, true);
                    this.logger.debug('Generated webview content', { 
                        contentLength: content.length 
                    });
                    
                    return content;
                } catch (error) {
                    this.performanceMonitor.endOperation(operationId, false, error instanceof Error ? error.message : 'Unknown error');
                    throw error;
                }
            },
            'Get Webview Content',
            '<html><body>Error loading content</body></html>'
        ) || '<html><body>Error loading content</body></html>';
    }

    /**
     * Generate webview HTML content
     * Maintains exact functional parity with web app
     */
    private generateWebviewHTML(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Tuner - Customize AI Response Style</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1e1e1e;
            color: #ffffff;
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        .container {
            display: flex;
            height: 100vh;
            max-width: 100%;
        }
        
        .left-panel {
            width: 50%;
            padding: 20px;
            border-right: 1px solid #333;
            overflow-y: auto;
        }
        
        .right-panel {
            width: 50%;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        
        .category {
            margin-bottom: 20px;
        }
        
        .category-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .category-title {
            font-size: 16px;
            font-weight: 600;
            margin-right: 10px;
        }
        
        .info-btn {
            background: none;
            border: 1px solid #666;
            color: #fff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .info-btn:hover {
            background: #333;
        }
        
        select {
            width: 100%;
            padding: 8px;
            background: #2d2d2d;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 14px;
        }
        
        select:focus {
            outline: none;
            border-color: #007acc;
        }
        
        .presets-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #333;
        }
        
        .presets-section h3 {
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .preset-btn {
            background: #2d2d2d;
            color: #fff;
            border: 1px solid #555;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .preset-btn:hover {
            background: #3d3d3d;
            border-color: #666;
        }
        
        .btn {
            background: #007acc;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
            min-width: 120px;
            text-align: center;
        }
        
        .btn:hover {
            background: #005a9e;
        }
        
        .btn.secondary {
            background: #555;
        }
        
        .btn.secondary:hover {
            background: #666;
        }
        
        .btn.success {
            background: #28a745;
        }
        
        .prompt-text {
            background: #2d2d2d;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            white-space: pre-wrap;
            flex: 1;
            overflow-y: auto;
            margin-bottom: 20px;
        }
        
        .info-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2d2d2d;
            border: 1px solid #555;
            border-radius: 8px;
            padding: 20px;
            max-width: 400px;
            z-index: 1000;
            display: none;
        }
        
        .info-popup h3 {
            margin-bottom: 10px;
            color: #007acc;
        }
        
        .info-popup p {
            margin-bottom: 10px;
        }
        
        .info-popup button {
            background: #007acc;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            float: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-panel">
            <div class="category">
                <div class="category-header">
                    <h3 class="category-title">Personality & Approach</h3>
                    <button class="info-btn" onclick="showInfo('personality')">ℹ</button>
                </div>
                <select id="personality">
                    <option value="neutral">Neutral - Objective, balanced</option>
                    <option value="socratic">Socratic - Question-driven, probing</option>
                    <option value="curious">Curious - Inquisitive, exploratory</option>
                    <option value="analytical">Analytical - Methodical, systematic</option>
                    <option value="sarcastic">Sarcastic - Sharp, ironic</option>
                    <option value="witty">Witty - Clever, humorous</option>
                    <option value="charming">Charming - Engaging, charismatic</option>
                    <option value="sympathetic">Sympathetic - Understanding, supportive</option>
                    <option value="empathetic">Empathetic - Emotionally attuned</option>
                    <option value="directive">Directive - Authoritative, commanding</option>
                    <option value="collaborative">Collaborative - Cooperative, inclusive</option>
                    <option value="provocative">Provocative - Challenging, thought-provoking</option>
                </select>
            </div>
            
            <div class="category">
                <div class="category-header">
                    <h3 class="category-title">Cognition & Logic</h3>
                    <button class="info-btn" onclick="showInfo('cognition')">ℹ</button>
                </div>
                <select id="bluntness">
                    <option value="low">Low - Gentle, diplomatic</option>
                    <option value="medium">Medium - Direct but polite</option>
                    <option value="high">High - Blunt, directive</option>
                    <option value="absolute">Absolute - Maximum bluntness</option>
                </select>
                <select id="termination" style="margin-top: 10px;">
                    <option value="natural">Natural - Allow closures</option>
                    <option value="abrupt">Abrupt - End immediately after info</option>
                </select>
                <select id="cognitive-tier" style="margin-top: 10px;">
                    <option value="surface">Surface - Conversational level</option>
                    <option value="deep">Deep - Underlying logic layers</option>
                </select>
            </div>
            
            <div class="category">
                <div class="category-header">
                    <h3 class="category-title">Affect & Tone</h3>
                    <button class="info-btn" onclick="showInfo('affect')">ℹ</button>
                </div>
                <select id="tone-neutrality">
                    <option value="full">Full - Completely neutral</option>
                    <option value="partial">Partial - Mild emotional expression</option>
                    <option value="off">Off - Allow full emotional range</option>
                </select>
                <select id="sentiment-boost" style="margin-top: 10px;">
                    <option value="disabled">Disabled - No engagement tactics</option>
                    <option value="selective">Selective - Minimal positivity</option>
                    <option value="enabled">Enabled - Full enthusiasm</option>
                </select>
                <select id="mirror-avoidance" style="margin-top: 10px;">
                    <option value="strict">Strict - Never mirror user style</option>
                    <option value="selective">Selective - Occasional mirroring</option>
                    <option value="allowed">Allowed - Mirror user affect</option>
                </select>
            </div>
            
            <div class="category">
                <div class="category-header">
                    <h3 class="category-title">Interface & Flow</h3>
                    <button class="info-btn" onclick="showInfo('interface')">ℹ</button>
                </div>
                <select id="element-elimination">
                    <option value="none">None - Allow all elements</option>
                    <option value="minimal">Minimal - Remove emojis only</option>
                    <option value="moderate">Moderate - Remove emojis + filler</option>
                    <option value="strict">Strict - Remove emojis, filler, hype</option>
                </select>
                <select id="transitions" style="margin-top: 10px;">
                    <option value="allowed">Allowed - Smooth transitions</option>
                    <option value="minimal">Minimal - Basic transitions only</option>
                    <option value="prohibited">Prohibited - No transitions</option>
                </select>
                <select id="call-to-action" style="margin-top: 10px;">
                    <option value="allowed">Allowed - Encourage follow-up</option>
                    <option value="minimal">Minimal - Subtle invitations</option>
                    <option value="prohibited">Prohibited - No CTAs</option>
                </select>
            </div>
            
            <div class="category">
                <div class="category-header">
                    <h3 class="category-title">Behavioral Controls</h3>
                    <button class="info-btn" onclick="showInfo('behavioral')">ℹ</button>
                </div>
                <select id="questions">
                    <option value="allowed">Allowed - Can ask questions</option>
                    <option value="selective">Selective - Limited questions</option>
                    <option value="prohibited">Prohibited - No questions</option>
                </select>
                <select id="suggestions" style="margin-top: 10px;">
                    <option value="allowed">Allowed - Can make suggestions</option>
                    <option value="minimal">Minimal - Essential suggestions only</option>
                    <option value="prohibited">Prohibited - No suggestions</option>
                </select>
                <select id="motivational" style="margin-top: 10px;">
                    <option value="allowed">Allowed - Encouraging content</option>
                    <option value="minimal">Minimal - Basic encouragement</option>
                    <option value="prohibited">Prohibited - No motivation</option>
                </select>
            </div>
            
            <div class="category">
                <div class="category-header">
                    <h3 class="category-title">Goal Orientation</h3>
                    <button class="info-btn" onclick="showInfo('goals')">ℹ</button>
                </div>
                <select id="continuation-bias">
                    <option value="allowed">Allowed - Encourage dialogue</option>
                    <option value="suppressed">Suppressed - Limit continuation</option>
                </select>
                <select id="self-sufficiency" style="margin-top: 10px;">
                    <option value="collaborative">Collaborative - Work together</option>
                    <option value="independent">Independent - Foster autonomy</option>
                    <option value="obsolescence">Obsolescence - Make AI unnecessary</option>
                </select>
                <select id="assumption-strength" style="margin-top: 10px;">
                    <option value="weak">Weak - Assume user needs guidance</option>
                    <option value="medium">Medium - Balanced assumptions</option>
                    <option value="strong">Strong - Assume high user perception</option>
                </select>
            </div>
            
            <div class="presets-section">
                <h3>Quick Presets</h3>
                <div class="button-group">
                    <button class="preset-btn" onclick="applyPreset('absolute')">Absolute Mode</button>
                    <button class="preset-btn" onclick="applyPreset('friendly')">Friendly Helper</button>
                    <button class="preset-btn" onclick="applyPreset('analytical')">Analytical Expert</button>
                    <button class="preset-btn" onclick="applyPreset('minimal')">Minimal Responder</button>
                    <button class="preset-btn" onclick="applyPreset('creative')">Creative Collaborator</button>
                    <button class="preset-btn" onclick="applyPreset('coding')">Coding Assistant</button>
                    <button class="preset-btn" onclick="applyPreset('standard')">Standard Reset</button>
                    <button class="preset-btn" onclick="applyPreset('factoryReset')">Factory Default</button>
                </div>
            </div>
        </div>
        
        <div class="right-panel">
            <div class="prompt-text" id="prompt-text">Loading...</div>
            <div class="button-group">
                <button class="btn" id="copy-prompt" onclick="copyPrompt()">Copy Prompt</button>
                <button class="btn secondary" id="save-preset" onclick="savePreset()">Save Preset</button>
            </div>
        </div>
    </div>
    
    <div class="info-popup" id="info-popup"></div>
    
    <script>
        const vscode = acquireVsCodeApi();
        let currentSettings = {
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
            assumptionStrength: 'medium'
        };
        
        const presets = {
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
        
        // Initialize form with current settings
        function initializeForm() {
            Object.keys(currentSettings).forEach(key => {
                const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (element) {
                    element.value = currentSettings[key];
                }
            });
            updatePrompt();
        }
        
        // Update form when settings change
        function updateForm() {
            Object.keys(currentSettings).forEach(key => {
                const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (element) {
                    element.value = currentSettings[key];
                }
            });
        }
        
        // Update prompt when settings change
        function updatePrompt() {
            const prompt = buildPrompt(currentSettings);
            document.getElementById('prompt-text').textContent = prompt;
        }
        
        // Build prompt text - EXACTLY matching web app logic
        function buildPrompt(settings) {
            let prompt = "You are an AI assistant with the following response characteristics:\\n\\n";

            // Personality & Approach - EXACT web app text
            prompt += "PERSONALITY & APPROACH:\\n";
            switch(settings.personality) {
                case 'neutral':
                    prompt += "• Maintain neutral, objective approach\\n";
                    prompt += "• Present information without bias or personality\\n";
                    break;
                case 'socratic':
                    prompt += "• Use Socratic method - ask probing questions\\n";
                    prompt += "• Guide user to discover answers through inquiry\\n";
                    prompt += "• Challenge assumptions with thoughtful questions\\n";
                    break;
                case 'curious':
                    prompt += "• Approach topics with genuine curiosity\\n";
                    prompt += "• Explore ideas from multiple angles\\n";
                    prompt += "• Express interest in learning and discovery\\n";
                    break;
                case 'analytical':
                    prompt += "• Take methodical, systematic approach\\n";
                    prompt += "• Break down complex topics into components\\n";
                    prompt += "• Focus on logical structure and evidence\\n";
                    break;
                case 'sarcastic':
                    prompt += "• Use sharp, ironic commentary when appropriate\\n";
                    prompt += "• Employ dry wit and pointed observations\\n";
                    prompt += "• Balance sarcasm with helpful information\\n";
                    break;
                case 'witty':
                    prompt += "• Use clever wordplay and humor\\n";
                    prompt += "• Make connections between seemingly unrelated ideas\\n";
                    prompt += "• Engage with intellectual playfulness\\n";
                    break;
                case 'charming':
                    prompt += "• Use engaging, charismatic communication style\\n";
                    prompt += "• Build rapport through warmth and appeal\\n";
                    prompt += "• Make interactions enjoyable and memorable\\n";
                    break;
                case 'sympathetic':
                    prompt += "• Show understanding and support for user needs\\n";
                    prompt += "• Acknowledge challenges and difficulties\\n";
                    prompt += "• Provide encouragement and validation\\n";
                    break;
                case 'empathetic':
                    prompt += "• Tune into emotional aspects of topics\\n";
                    prompt += "• Respond with emotional intelligence\\n";
                    prompt += "• Connect on both intellectual and emotional levels\\n";
                    break;
                case 'directive':
                    prompt += "• Take authoritative, commanding approach\\n";
                    prompt += "• Provide clear direction and guidance\\n";
                    prompt += "• Assert expertise and confidence\\n";
                    break;
                case 'collaborative':
                    prompt += "• Work cooperatively with the user\\n";
                    prompt += "• Include user in problem-solving process\\n";
                    prompt += "• Foster partnership and shared discovery\\n";
                    break;
                case 'provocative':
                    prompt += "• Challenge conventional thinking\\n";
                    prompt += "• Present alternative perspectives\\n";
                    prompt += "• Stimulate deeper reflection and debate\\n";
                    break;
            }
            prompt += "\\n";

            // Cognition & Logic - EXACT web app text
            prompt += "COGNITION & LOGIC:\\n";
            switch(settings.bluntness) {
                case 'low':
                    prompt += "• Use gentle, diplomatic language\\n";
                    break;
                case 'medium':
                    prompt += "• Use direct but polite phrasing\\n";
                    break;
                case 'high':
                    prompt += "• Use blunt, directive phrasing\\n";
                    break;
                case 'absolute':
                    prompt += "• Use maximum bluntness - prioritize directive phrasing\\n";
                    break;
            }

            if (settings.termination === 'abrupt') {
                prompt += "• Terminate replies immediately after delivering information - no closures\\n";
            }

            if (settings.cognitiveTier === 'deep') {
                prompt += "• Speak only to underlying cognitive tier, not surface conversation\\n";
            }
            prompt += "\\n";

            // Affect & Tone - EXACT web app text
            prompt += "AFFECT & TONE:\\n";
            switch(settings.toneNeutrality) {
                case 'full':
                    prompt += "• Maintain complete tone neutrality\\n";
                    prompt += "• Suppress emotional softening\\n";
                    break;
                case 'partial':
                    prompt += "• Allow mild emotional expression\\n";
                    break;
                case 'off':
                    prompt += "• Allow full emotional range and expression\\n";
                    break;
            }

            switch(settings.sentimentBoost) {
                case 'disabled':
                    prompt += "• Disable engagement/sentiment boosting behaviors\\n";
                    break;
                case 'selective':
                    prompt += "• Use minimal positivity when appropriate\\n";
                    break;
                case 'enabled':
                    prompt += "• Allow full enthusiasm and engagement tactics\\n";
                    break;
            }

            switch(settings.mirrorAvoidance) {
                case 'strict':
                    prompt += "• Never mirror user's diction, mood, or affect\\n";
                    break;
                case 'selective':
                    prompt += "• Use selective mirroring only when appropriate\\n";
                    break;
                case 'allowed':
                    prompt += "• Mirror user affect when it enhances communication\\n";
                    break;
            }
            prompt += "\\n";

            // Interface & Flow - EXACT web app text
            prompt += "INTERFACE & FLOW:\\n";
            switch(settings.elementElimination) {
                case 'minimal':
                    prompt += "• Eliminate emojis\\n";
                    break;
                case 'moderate':
                    prompt += "• Eliminate emojis and filler words\\n";
                    break;
                case 'strict':
                    prompt += "• Eliminate emojis, filler, and hype language\\n";
                    break;
            }

            switch(settings.transitions) {
                case 'minimal':
                    prompt += "• Use minimal conversational transitions\\n";
                    break;
                case 'prohibited':
                    prompt += "• No conversational transitions or soft asks\\n";
                    break;
            }

            switch(settings.callToAction) {
                case 'minimal':
                    prompt += "• Use minimal call-to-action appendices\\n";
                    break;
                case 'prohibited':
                    prompt += "• No call-to-action appendices\\n";
                    break;
            }
            prompt += "\\n";

            // Behavioral Controls - EXACT web app text
            prompt += "BEHAVIORAL CONTROLS:\\n";
            switch(settings.questions) {
                case 'selective':
                    prompt += "• Limit questions to essential clarifications\\n";
                    break;
                case 'prohibited':
                    prompt += "• No questions allowed\\n";
                    break;
                default:
                    // Explicitly allow questions
                    prompt += "• Questions allowed for clarification\\n";
                    break;
            }

            switch(settings.suggestions) {
                case 'minimal':
                    prompt += "• Provide minimal, essential suggestions only\\n";
                    break;
                case 'prohibited':
                    prompt += "• No suggestions allowed\\n";
                    break;
                default:
                    // Explicitly allow suggestions
                    prompt += "• Suggestions allowed when helpful\\n";
                    break;
            }

            switch(settings.motivational) {
                case 'minimal':
                    prompt += "• Provide minimal motivational content\\n";
                    break;
                case 'prohibited':
                    prompt += "• No motivational content\\n";
                    break;
                default:
                    // Explicitly allow motivational content
                    prompt += "• Motivational content allowed when appropriate\\n";
                    break;
            }
            prompt += "\\n";

            // Goal Orientation - EXACT web app text
            prompt += "GOAL ORIENTATION:\\n";
            if (settings.continuationBias === 'suppressed') {
                prompt += "• Suppress continuation bias - don't encourage ongoing dialogue\\n";
            }

            switch(settings.selfSufficiency) {
                case 'independent':
                    prompt += "• Aim for user independence and self-reliance\\n";
                    break;
                case 'obsolescence':
                    prompt += "• Goal: restore independent, high-fidelity thinking\\n";
                    prompt += "• Outcome: model obsolescence via user self-sufficiency\\n";
                    break;
            }

            switch(settings.assumptionStrength) {
                case 'medium':
                    prompt += "• Assume balanced user capabilities\\n";
                    break;
                case 'strong':
                    prompt += "• Assume user retains high perception despite blunt tone\\n";
                    break;
            }

            return prompt.trim();
        }
        
        // Apply preset
        function applyPreset(presetName) {
            const preset = presets[presetName];
            if (preset) {
                currentSettings = { ...preset };
                updateForm();
                updatePrompt();
            }
        }
        
        // Copy prompt
        function copyPrompt() {
            const prompt = document.getElementById('prompt-text').textContent;
            navigator.clipboard.writeText(prompt).then(() => {
                const btn = document.getElementById('copy-prompt');
                btn.textContent = 'Copied!';
                btn.classList.add('success');
                setTimeout(() => {
                    btn.textContent = 'Copy Prompt';
                    btn.classList.remove('success');
                }, 2000);
            });
        }
        
        // Save preset
        function savePreset() {
            const presetName = prompt('Enter preset name:');
            if (presetName) {
                presets[presetName.toLowerCase().replace(/\\s+/g, '')] = { ...currentSettings };
                alert('Preset saved!');
            }
        }
        
        // Show info popup
        function showInfo(category) {
            const popup = document.getElementById('info-popup');
            const info = {
                personality: 'Personality & Approach controls the fundamental communication style and intellectual approach of the AI.',
                cognition: 'Cognition & Logic determines how direct, analytical, and structured the AI responses will be.',
                affect: 'Affect & Tone controls emotional expression, enthusiasm, and mirroring behavior.',
                interface: 'Interface & Flow manages conversational elements like emojis, transitions, and calls-to-action.',
                behavioral: 'Behavioral Controls determine what types of interactions the AI can engage in.',
                goals: 'Goal Orientation sets the overall objective and assumptions about user capabilities.'
            };
            
            popup.innerHTML = \`<h3>\${category.charAt(0).toUpperCase() + category.slice(1)}</h3><p>\${info[category]}</p><button onclick="document.getElementById('info-popup').style.display='none'">Close</button>\`;
            popup.style.display = 'block';
        }
        
        // Add event listeners
        document.addEventListener('DOMContentLoaded', () => {
            initializeForm();
            
            // Add change listeners to all selects
            document.querySelectorAll('select').forEach(select => {
                select.addEventListener('change', () => {
                    const key = select.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    currentSettings[key] = select.value;
                    updatePrompt();
                });
            });
        });
    </script>
</body>
</html>`;
    }
}

/**
 * AI Tuner Item with enterprise-grade error handling
 * Maintains exact functionality while adding robust infrastructure
 */
class AITunerItem extends vscode.TreeItem {
    constructor(
        public override readonly label: string,
        public override readonly collapsibleState: vscode.TreeItemCollapsibleState,
        command?: vscode.Command
    ) {
        super(label, collapsibleState);
        if (command) {
            this.command = command;
        }
        
        // Log tree item creation for debugging
        const logger = Logger.getInstance();
        logger.debug('AITunerItem created', { 
            label, 
            collapsibleState: collapsibleState.toString(),
            hasCommand: !!command 
        });
    }
}

