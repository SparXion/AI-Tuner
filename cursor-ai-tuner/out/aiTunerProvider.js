"use strict";
/**
 * @fileoverview Enterprise-grade AI Tuner Provider with comprehensive monitoring and error handling
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITunerItem = exports.AITunerProvider = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("./types");
const logger_1 = require("./logger");
const performanceMonitor_1 = require("./performanceMonitor");
const errorHandler_1 = require("./errorHandler");
const configurationValidator_1 = require("./configurationValidator");
/**
 * Presets matching web app exactly with enterprise-grade validation
 */
const PRESETS = {
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
/**
 * Enterprise-grade AI Tuner Provider with comprehensive monitoring
 * @class AITunerProvider
 */
class AITunerProvider {
    /**
     * Private constructor for singleton pattern
     * @param _context - VS Code extension context
     */
    constructor(_context) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.customPresets = new Map();
        // Initialize enterprise-grade configuration
        this.extensionConfig = this.initializeExtensionConfig();
        // Initialize enterprise-grade systems
        this.logger = logger_1.Logger.getInstance(this.extensionConfig);
        this.performanceMonitor = performanceMonitor_1.PerformanceMonitor.getInstance(this.extensionConfig, this.logger);
        this.errorHandler = errorHandler_1.ErrorHandler.getInstance(this.extensionConfig, this.logger, this.performanceMonitor);
        this.configurationValidator = configurationValidator_1.ConfigurationValidator.getInstance(this.extensionConfig, this.logger, this.errorHandler);
        // Initialize core functionality
        this.currentSettings = this.configurationValidator.getDefaultSettings();
        this.loadCustomPresets();
        this.logger.info('AI Tuner Provider initialized', 'AITunerProvider', {
            version: '2.0.0',
            features: {
                performanceMonitoring: this.extensionConfig.enablePerformanceMonitoring,
                detailedLogging: this.extensionConfig.enableDetailedLogging,
                errorReporting: this.extensionConfig.enableErrorReporting,
                memoryMonitoring: this.extensionConfig.enableMemoryMonitoring
            }
        });
    }
    /**
     * Get singleton instance
     * @param context - VS Code extension context
     * @returns AITunerProvider instance
     */
    static getInstance(context) {
        if (!AITunerProvider.instance && context) {
            AITunerProvider.instance = new AITunerProvider(context);
        }
        if (!AITunerProvider.instance) {
            throw new Error('AITunerProvider must be initialized with VS Code extension context');
        }
        return AITunerProvider.instance;
    }
    /**
     * Initialize extension configuration with enterprise-grade defaults
     * @returns Extension configuration
     */
    initializeExtensionConfig() {
        const config = vscode.workspace.getConfiguration('aiTuner');
        return {
            enablePerformanceMonitoring: config.get('enablePerformanceMonitoring', true),
            enableDetailedLogging: config.get('enableDetailedLogging', true),
            logLevel: config.get('logLevel', types_1.LogLevel.INFO),
            enableErrorReporting: config.get('enableErrorReporting', true),
            maxLogEntries: config.get('maxLogEntries', 1000),
            enableMemoryMonitoring: config.get('enableMemoryMonitoring', true)
        };
    }
    /**
     * Load custom presets with enterprise-grade validation
     */
    async loadCustomPresets() {
        const operationId = this.performanceMonitor.startOperation('load_custom_presets');
        try {
            const config = vscode.workspace.getConfiguration('aiTuner');
            const rawPresets = config.get('customPresets', {});
            this.logger.debug('Loading custom presets', 'AITunerProvider', {
                presetCount: Object.keys(rawPresets).length
            });
            // Validate each preset
            for (const [name, preset] of Object.entries(rawPresets)) {
                const validation = this.configurationValidator.validateSettings(preset, 'custom_preset');
                if (validation.isValid && validation.settings) {
                    this.customPresets.set(name, validation.settings);
                    this.logger.debug(`Loaded custom preset: ${name}`, 'AITunerProvider');
                }
                else {
                    this.logger.warn(`Invalid custom preset skipped: ${name}`, 'AITunerProvider', {
                        errors: validation.errors,
                        warnings: validation.warnings
                    });
                }
            }
            this.logger.info(`Custom presets loaded successfully`, 'AITunerProvider', {
                loadedCount: this.customPresets.size,
                skippedCount: Object.keys(rawPresets).length - this.customPresets.size
            });
        }
        catch (error) {
            const context = {
                operation: 'load_custom_presets',
                component: 'AITunerProvider',
                context: { presetCount: this.customPresets.size }
            };
            await this.errorHandler.handleError(error, context);
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
    /**
     * Update settings with enterprise-grade validation and error handling
     * @param newSettings - New settings to apply
     */
    async updateSettings(newSettings) {
        const operationId = this.performanceMonitor.startOperation('update_settings');
        try {
            // Validate new settings
            const validation = this.configurationValidator.validateSettings(newSettings, 'user_input');
            if (!validation.isValid) {
                const context = {
                    operation: 'update_settings',
                    component: 'AITunerProvider',
                    context: {
                        errors: validation.errors,
                        warnings: validation.warnings,
                        newSettings
                    }
                };
                throw new errorHandler_1.ValidationError(`Settings validation failed: ${validation.errors.join(', ')}`, context);
            }
            // Apply validated settings
            this.currentSettings = { ...this.currentSettings, ...validation.settings };
            // Update webview if it exists
            if (this.webviewPanel) {
                await this.updateWebview();
            }
            this.logger.info('Settings updated successfully', 'AITunerProvider', {
                updatedFields: Object.keys(newSettings),
                warnings: validation.warnings
            });
            // Show warnings to user if any
            if (validation.warnings.length > 0) {
                await vscode.window.showWarningMessage(`Settings updated with warnings: ${validation.warnings.join(', ')}`);
            }
        }
        catch (error) {
            const context = {
                operation: 'update_settings',
                component: 'AITunerProvider',
                context: { newSettings }
            };
            await this.errorHandler.handleError(error, context);
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
    /**
     * Apply preset with enterprise-grade validation
     * @param presetName - Name of preset to apply
     */
    async applyPreset(presetName) {
        const operationId = this.performanceMonitor.startOperation('apply_preset');
        try {
            // Sanitize preset name
            const sanitizedName = this.configurationValidator.sanitizeInput(presetName);
            // Get preset from built-in or custom presets
            let preset;
            if (PRESETS[sanitizedName]) {
                preset = PRESETS[sanitizedName];
                this.logger.debug(`Applying built-in preset: ${sanitizedName}`, 'AITunerProvider');
            }
            else if (this.customPresets.has(sanitizedName)) {
                preset = this.customPresets.get(sanitizedName);
                this.logger.debug(`Applying custom preset: ${sanitizedName}`, 'AITunerProvider');
            }
            else {
                throw new errorHandler_1.ValidationError(`Preset not found: ${sanitizedName}`, {
                    operation: 'apply_preset',
                    component: 'AITunerProvider',
                    context: { presetName: sanitizedName }
                });
            }
            // Apply preset
            if (preset) {
                await this.updateSettings(preset);
            }
            else {
                throw new errorHandler_1.ValidationError(`Preset not found: ${sanitizedName}`, {
                    operation: 'apply_preset',
                    component: 'AITunerProvider',
                    context: { presetName: sanitizedName }
                });
            }
            this.logger.info(`Preset applied successfully: ${sanitizedName}`, 'AITunerProvider');
        }
        catch (error) {
            const context = {
                operation: 'apply_preset',
                component: 'AITunerProvider',
                context: { presetName }
            };
            await this.errorHandler.handleError(error, context);
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
    /**
     * Update webview with current settings
     */
    async updateWebview() {
        if (!this.webviewPanel) {
            return;
        }
        try {
            await this.webviewPanel.webview.postMessage({
                command: 'updateSettings',
                data: this.currentSettings,
                timestamp: Date.now()
            });
        }
        catch (error) {
            const context = {
                operation: 'update_webview',
                component: 'AITunerProvider',
                context: { settings: this.currentSettings }
            };
            await this.errorHandler.handleError(error, context);
        }
    }
    /**
     * Get tree item for VS Code tree view
     * @param element - Tree item element
     * @returns VS Code tree item
     */
    getTreeItem(element) {
        return element;
    }
    /**
     * Get children for tree view
     * @param element - Parent element
     * @returns Array of child elements
     */
    getChildren(element) {
        const operationId = this.performanceMonitor.startOperation('get_tree_children');
        try {
            if (!element) {
                // Root level - show presets
                const items = [];
                // Built-in presets
                for (const [name] of Object.entries(PRESETS)) {
                    items.push(new AITunerItem(name.charAt(0).toUpperCase() + name.slice(1), vscode.TreeItemCollapsibleState.None, {
                        title: `Apply ${name} preset`,
                        command: 'aiTuner.applyPreset',
                        arguments: [name]
                    }, `Apply ${name} preset configuration`));
                }
                // Custom presets
                for (const [name] of this.customPresets) {
                    items.push(new AITunerItem(`Custom: ${name}`, vscode.TreeItemCollapsibleState.None, {
                        title: `Apply custom ${name} preset`,
                        command: 'aiTuner.applyPreset',
                        arguments: [name]
                    }, `Apply custom ${name} preset configuration`));
                }
                return Promise.resolve(items);
            }
            return Promise.resolve([]);
        }
        catch (error) {
            const context = {
                operation: 'get_tree_children',
                component: 'AITunerProvider',
                context: { element: element?.label }
            };
            this.errorHandler.handleError(error, context);
            return Promise.resolve([]);
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
    /**
     * Refresh tree view
     */
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    /**
     * Create webview panel with enterprise-grade security and error handling
     * @param context - VS Code extension context
     * @returns Webview panel
     */
    createWebviewPanel(context) {
        const operationId = this.performanceMonitor.startOperation('create_webview_panel');
        try {
            this.webviewPanel = vscode.window.createWebviewPanel('aiTuner', 'AI Tuner', vscode.ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [context.extensionUri]
            });
            this.webviewPanel.webview.html = this.getWebviewContent();
            // Handle messages from webview with enterprise-grade validation
            this.webviewPanel.webview.onDidReceiveMessage(async (message) => {
                await this.handleWebviewMessage(message);
            }, undefined, context.subscriptions);
            // Handle panel disposal
            this.webviewPanel.onDidDispose(() => {
                this.webviewPanel = undefined;
                this.logger.info('Webview panel disposed', 'AITunerProvider');
            });
            this.logger.info('Webview panel created successfully', 'AITunerProvider');
            return this.webviewPanel;
        }
        catch (error) {
            const context = {
                operation: 'create_webview_panel',
                component: 'AITunerProvider'
            };
            this.errorHandler.handleError(error, context);
            throw error;
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
    /**
     * Handle webview messages with enterprise-grade validation and security
     * @param message - Message from webview
     */
    async handleWebviewMessage(message) {
        const operationId = this.performanceMonitor.startOperation('handle_webview_message');
        try {
            // Validate message structure
            if (!message.command || typeof message.command !== 'string') {
                throw new errorHandler_1.ValidationError('Invalid message structure', {
                    operation: 'handle_webview_message',
                    component: 'AITunerProvider',
                    context: { message }
                });
            }
            // Sanitize command
            const sanitizedCommand = this.configurationValidator.sanitizeInput(message.command);
            this.logger.debug(`Handling webview message: ${sanitizedCommand}`, 'AITunerProvider', {
                command: sanitizedCommand,
                hasData: !!message.data
            });
            switch (sanitizedCommand) {
                case 'updateSettings':
                    if (message.data && typeof message.data === 'object') {
                        await this.updateSettings(message.data);
                    }
                    break;
                case 'applyPreset':
                    if (message.data && typeof message.data === 'object' && 'presetName' in message.data) {
                        const presetName = this.configurationValidator.sanitizeInput(String(message.data['presetName']));
                        await this.applyPreset(presetName);
                    }
                    break;
                case 'showMessage':
                    if (message.data && typeof message.data === 'object' && 'type' in message.data && 'text' in message.data) {
                        const type = this.configurationValidator.sanitizeInput(String(message.data['type']));
                        const text = this.configurationValidator.sanitizeInput(String(message.data['text']));
                        switch (type) {
                            case 'info':
                                await vscode.window.showInformationMessage(text);
                                break;
                            case 'warning':
                                await vscode.window.showWarningMessage(text);
                                break;
                            case 'error':
                                await vscode.window.showErrorMessage(text);
                                break;
                        }
                    }
                    break;
                default:
                    this.logger.warn(`Unknown webview command: ${sanitizedCommand}`, 'AITunerProvider');
            }
        }
        catch (error) {
            const context = {
                operation: 'handle_webview_message',
                component: 'AITunerProvider',
                context: { message }
            };
            await this.errorHandler.handleError(error, context);
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
    /**
     * Get webview content with enterprise-grade security and exact web app matching
     * @returns HTML content for webview
     */
    getWebviewContent() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Tuner</title>
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
            background: #007acc;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .info-btn:hover {
            background: #005a9e;
        }
        
        select {
            width: 100%;
            padding: 8px;
            background: #2d2d2d;
            color: white;
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
        
        .preset-btn {
            background: #007acc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin: 4px;
            transition: background 0.2s;
        }
        
        .preset-btn:hover {
            background: #005a9e;
        }
        
        .btn {
            padding: 8px 16px;
            background: #007acc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
            margin-bottom: 10px;
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
            background: #1e1e1e;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            white-space: pre-wrap;
            word-wrap: break-word;
            flex: 1;
            overflow-y: auto;
            margin-bottom: 15px;
        }
        
        .button-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .info-popup {
            position: absolute;
            background: #2d2d2d;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 10px;
            max-width: 300px;
            font-size: 12px;
            z-index: 1000;
            display: none;
        }
        
        .info-popup.show {
            display: block;
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
        let currentSettings = ${JSON.stringify(this.currentSettings)};
        
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
            const presets = ${JSON.stringify(PRESETS)};
            const preset = presets[presetName];
            if (preset) {
                currentSettings = { ...currentSettings, ...preset };
                updateForm();
                updatePrompt();
            }
        }
        
        // Copy prompt to clipboard
        function copyPrompt() {
            const promptText = document.getElementById('prompt-text').textContent;
            navigator.clipboard.writeText(promptText).then(() => {
                const copyBtn = document.getElementById('copy-prompt');
                copyBtn.textContent = "Copied!";
                copyBtn.classList.add('success');
                setTimeout(() => {
                    copyBtn.textContent = "Copy Prompt";
                    copyBtn.classList.remove('success');
                }, 2000);
                
                vscode.postMessage({
                    command: 'showMessage',
                    type: 'info',
                    text: 'Prompt copied to clipboard!'
                });
            }).catch(err => {
                console.error('Failed to copy prompt:', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = promptText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const copyBtn = document.getElementById('copy-prompt');
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.textContent = "Copy Prompt";
                }, 2000);
                
                vscode.postMessage({
                    command: 'showMessage',
                    type: 'info',
                    text: 'Prompt copied to clipboard!'
                });
            });
        }
        
        // Save preset
        function savePreset() {
            const name = prompt('Enter preset name:');
            if (name) {
                vscode.postMessage({
                    command: 'savePreset',
                    data: { name: name, settings: currentSettings }
                });
            }
        }
        
        // Show info popup
        function showInfo(category) {
            const popup = document.getElementById('info-popup');
            const infoTexts = {
                personality: 'Controls the overall personality and approach of the AI assistant.',
                cognition: 'Manages logical processing depth and communication style.',
                affect: 'Regulates emotional expression and tone management.',
                interface: 'Controls UI elements and conversational flow.',
                behavioral: 'Manages question asking, suggestions, and motivational content.',
                goals: 'Sets objectives for user interaction and self-sufficiency.'
            };
            
            popup.textContent = infoTexts[category] || 'No information available.';
            popup.classList.add('show');
            
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }
        
        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'updateSettings') {
                currentSettings = { ...currentSettings, ...message.data };
                updateForm();
                updatePrompt();
            }
        });
        
        // Add event listeners to form elements
        document.addEventListener('DOMContentLoaded', () => {
            initializeForm();
            
            // Add change listeners to all select elements
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                select.addEventListener('change', () => {
                    const key = select.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    currentSettings[key] = select.value;
                    updatePrompt();
                    
                    // Send update to extension
                    vscode.postMessage({
                        command: 'updateSettings',
                        data: currentSettings
                    });
                });
            });
        });
    </script>
</body>
</html>`;
    }
    /**
     * Dispose of provider resources with enterprise-grade cleanup
     */
    dispose() {
        const operationId = this.performanceMonitor.startOperation('dispose_provider');
        try {
            // Dispose of enterprise-grade systems
            this.logger.dispose();
            this.performanceMonitor.dispose();
            this.errorHandler.dispose();
            this.configurationValidator.dispose();
            // Dispose of webview
            if (this.webviewPanel) {
                this.webviewPanel.dispose();
                this.webviewPanel = undefined;
            }
            // Clear data structures
            this.customPresets.clear();
            this.logger.info('AI Tuner Provider disposed successfully', 'AITunerProvider');
        }
        catch (error) {
            const context = {
                operation: 'dispose_provider',
                component: 'AITunerProvider'
            };
            this.errorHandler.handleError(error, context);
        }
        finally {
            this.performanceMonitor.endOperation(operationId);
        }
    }
}
exports.AITunerProvider = AITunerProvider;
/**
 * Tree item for VS Code tree view
 * @class AITunerItem
 */
class AITunerItem extends vscode.TreeItem {
    constructor(label, collapsibleState, command, tooltip) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.tooltip = tooltip;
        this.tooltip = tooltip;
        this.command = command;
    }
}
exports.AITunerItem = AITunerItem;
//# sourceMappingURL=aiTunerProvider.js.map