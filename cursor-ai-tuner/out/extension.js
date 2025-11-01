"use strict";
/**
 * @fileoverview Enterprise-grade AI Tuner Extension Entry Point
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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const aiTunerProvider_1 = require("./aiTunerProvider");
const panel_1 = require("./panel");
const logger_1 = require("./logger");
const performanceMonitor_1 = require("./performanceMonitor");
const errorHandler_1 = require("./errorHandler");
const configurationValidator_1 = require("./configurationValidator");
const types_1 = require("./types");
/**
 * Extension activation function with enterprise-grade initialization
 * @param context - VS Code extension context
 */
async function activate(context) {
    const startTime = performance.now();
    try {
        // Initialize enterprise-grade configuration
        const extensionConfig = {
            enablePerformanceMonitoring: true,
            enableDetailedLogging: true,
            logLevel: types_1.LogLevel.INFO,
            enableErrorReporting: true,
            maxLogEntries: 1000,
            enableMemoryMonitoring: true
        };
        // Initialize enterprise-grade systems
        const logger = logger_1.Logger.getInstance(extensionConfig);
        const performanceMonitor = performanceMonitor_1.PerformanceMonitor.getInstance(extensionConfig, logger);
        const errorHandler = errorHandler_1.ErrorHandler.getInstance(extensionConfig, logger, performanceMonitor);
        const configurationValidator = configurationValidator_1.ConfigurationValidator.getInstance(extensionConfig, logger, errorHandler);
        logger.info('AI Tuner Extension activating', 'Extension', {
            version: '2.0.0',
            activationTime: new Date().toISOString(),
            features: {
                performanceMonitoring: extensionConfig.enablePerformanceMonitoring,
                detailedLogging: extensionConfig.enableDetailedLogging,
                errorReporting: extensionConfig.enableErrorReporting,
                memoryMonitoring: extensionConfig.enableMemoryMonitoring
            }
        });
        // Initialize AI Tuner Provider
        const aiTunerProvider = aiTunerProvider_1.AITunerProvider.getInstance(context);
        // Register tree data provider
        const treeView = vscode.window.createTreeView('aiTunerPanel', {
            treeDataProvider: aiTunerProvider,
            showCollapseAll: true
        });
        // Register commands with enterprise-grade error handling
        const commands = [
            {
                command: 'aiTuner.openPanel',
                callback: () => openAITunerPanel(context, aiTunerProvider)
            },
            {
                command: 'aiTuner.applyPreset',
                callback: (presetName) => applyPreset(presetName, aiTunerProvider)
            },
            {
                command: 'aiTuner.showPerformanceReport',
                callback: () => showPerformanceReport(performanceMonitor)
            },
            {
                command: 'aiTuner.showErrorReport',
                callback: () => showErrorReport(errorHandler)
            },
            {
                command: 'aiTuner.exportLogs',
                callback: () => exportLogs(logger)
            },
            {
                command: 'aiTuner.resetConfiguration',
                callback: () => resetConfiguration(configurationValidator, aiTunerProvider)
            },
            {
                command: 'aiTuner.toggleElite',
                callback: () => toggleEliteMode(logger)
            },
            {
                command: 'aiTuner.resetBlends',
                callback: () => resetBlendCounter(context)
            }
        ];
        // Register all commands
        for (const { command, callback } of commands) {
            const disposable = vscode.commands.registerCommand(command, async (...args) => {
                const commandId = performanceMonitor.startOperation(`command_${command}`);
                try {
                    if (args.length === 0) {
                        await callback();
                    }
                    else {
                        await callback(...args);
                    }
                    logger.debug(`Command executed successfully: ${command}`, 'Extension', {
                        command,
                        args: args.length
                    });
                }
                catch (error) {
                    const _errorContext = {
                        operation: `execute_command_${command}`,
                        component: 'Extension',
                        context: { command, args }
                    };
                    await errorHandler.handleError(error, _errorContext);
                }
                finally {
                    performanceMonitor.endOperation(commandId);
                }
            });
            context.subscriptions.push(disposable);
        }
        // Register status bar item with enterprise-grade monitoring
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = "$(settings-gear) AI Tuner";
        statusBarItem.tooltip = "AI Tuner - Click to open";
        statusBarItem.command = 'aiTuner.openPanel';
        statusBarItem.show();
        context.subscriptions.push(statusBarItem);
        // Register tree view
        context.subscriptions.push(treeView);
        // Register configuration change listener
        const configChangeListener = vscode.workspace.onDidChangeConfiguration(async (event) => {
            if (event.affectsConfiguration('aiTuner')) {
                logger.info('Configuration changed, reloading settings', 'Extension');
                try {
                    // Reload configuration and reinitialize systems
                    await reloadConfiguration(extensionConfig, logger, performanceMonitor, errorHandler, configurationValidator);
                }
                catch (error) {
                    const errorContext = {
                        operation: 'reload_configuration',
                        component: 'Extension',
                        context: { event }
                    };
                    await errorHandler.handleError(error, errorContext);
                }
            }
        });
        context.subscriptions.push(configChangeListener);
        // Register memory monitoring if enabled
        if (extensionConfig.enableMemoryMonitoring) {
            const memoryMonitorInterval = setInterval(() => {
                const memoryStats = performanceMonitor.measureMemory();
                const memoryLeakCheck = performanceMonitor.checkMemoryLeaks();
                if (memoryLeakCheck.hasLeak && memoryLeakCheck.severity === 'high') {
                    logger.warn('High severity memory leak detected', 'Extension', {
                        memoryStats,
                        memoryLeakCheck
                    });
                    vscode.window.showWarningMessage(`AI Tuner memory usage is high: ${memoryLeakCheck.recommendation}`, 'Show Performance Report', 'Reset Performance Data').then(selection => {
                        if (selection === 'Show Performance Report') {
                            showPerformanceReport(performanceMonitor);
                        }
                        else if (selection === 'Reset Performance Data') {
                            performanceMonitor.reset();
                            vscode.window.showInformationMessage('Performance data has been reset.');
                        }
                    });
                }
            }, 30000); // Check every 30 seconds
            context.subscriptions.push({
                dispose: () => clearInterval(memoryMonitorInterval)
            });
        }
        const activationTime = performance.now() - startTime;
        logger.info('AI Tuner Extension activated successfully', 'Extension', {
            activationTime: `${activationTime.toFixed(2)}ms`,
            registeredCommands: commands.length,
            subscriptions: context.subscriptions.length
        });
        // Show activation message
        await vscode.window.showInformationMessage('AI Tuner Extension activated successfully!', 'Open AI Tuner', 'Show Performance Report').then(selection => {
            if (selection === 'Open AI Tuner') {
                vscode.commands.executeCommand('aiTuner.openPanel');
            }
            else if (selection === 'Show Performance Report') {
                vscode.commands.executeCommand('aiTuner.showPerformanceReport');
            }
        });
    }
    catch (error) {
        // Try to use logger if available, otherwise log to output channel
        let logger;
        try {
            logger = logger_1.Logger.getInstance();
            logger.error('Failed to activate AI Tuner Extension', 'Extension', error, {
                activationTime: new Date().toISOString(),
                errorDetails: error instanceof Error ? error.message : String(error)
            });
        }
        catch {
            // Logger not available - create output channel as fallback
            const outputChannel = vscode.window.createOutputChannel('AI Tuner');
            outputChannel.appendLine(`[ERROR] Failed to activate AI Tuner Extension: ${error instanceof Error ? error.message : String(error)}`);
            if (error instanceof Error && error.stack) {
                outputChannel.appendLine(error.stack);
            }
            outputChannel.show(true);
        }
        await vscode.window.showErrorMessage('Failed to activate AI Tuner Extension. Please check the output panel for details.', 'Show Output', 'Report Issue').then(selection => {
            if (selection === 'Show Output') {
                vscode.commands.executeCommand('workbench.action.output.show');
            }
            else if (selection === 'Report Issue') {
                const errorDetails = error instanceof Error
                    ? { message: error.message, stack: error.stack }
                    : { error: String(error) };
                const issueUrl = `https://github.com/SparXion/AI-Tuner/issues/new?title=Activation Error&body=${encodeURIComponent(JSON.stringify(errorDetails, null, 2))}`;
                vscode.env.openExternal(vscode.Uri.parse(issueUrl));
            }
        });
    }
}
exports.activate = activate;
/**
 * Extension deactivation function with enterprise-grade cleanup
 */
async function deactivate() {
    const startTime = performance.now();
    try {
        // Get logger instance if available
        let logger;
        try {
            logger = logger_1.Logger.getInstance();
        }
        catch {
            // Logger not available, use console
        }
        if (logger) {
            logger.info('AI Tuner Extension deactivating', 'Extension', {
                deactivationTime: new Date().toISOString()
            });
        }
        // Dispose of AI Tuner Provider
        const aiTunerProvider = aiTunerProvider_1.AITunerProvider.getInstance();
        aiTunerProvider.dispose();
        const deactivationTime = performance.now() - startTime;
        if (logger) {
            logger.info('AI Tuner Extension deactivated successfully', 'Extension', {
                deactivationTime: `${deactivationTime.toFixed(2)}ms`
            });
        }
    }
    catch (error) {
        // Try to use logger if available, otherwise log to output channel
        let logger;
        try {
            logger = logger_1.Logger.getInstance();
            logger.error('Error during extension deactivation', 'Extension', error, {
                deactivationTime: new Date().toISOString(),
                errorDetails: error instanceof Error ? error.message : String(error)
            });
        }
        catch {
            // Logger not available - create output channel as fallback
            const outputChannel = vscode.window.createOutputChannel('AI Tuner');
            outputChannel.appendLine(`[ERROR] Error during extension deactivation: ${error instanceof Error ? error.message : String(error)}`);
            if (error instanceof Error && error.stack) {
                outputChannel.appendLine(error.stack);
            }
            outputChannel.show(true);
        }
    }
}
exports.deactivate = deactivate;
/**
 * Open AI Tuner panel with enterprise-grade error handling
 * @param context - VS Code extension context
 * @param provider - AI Tuner provider instance
 */
async function openAITunerPanel(_context, _provider) {
    try {
        panel_1.AITunerPanel.createOrShow();
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to open AI Tuner panel. Please try again.', 'Retry', 'Show Details').then(selection => {
            if (selection === 'Retry') {
                vscode.commands.executeCommand('aiTuner.openPanel');
            }
            else if (selection === 'Show Details') {
                vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(JSON.stringify(error, null, 2)).toString('base64')}`));
            }
        });
    }
}
/**
 * Apply preset with enterprise-grade validation
 * @param presetName - Name of preset to apply
 * @param provider - AI Tuner provider instance
 */
async function applyPreset(presetName, provider) {
    try {
        await provider.applyPreset(presetName);
        await vscode.window.showInformationMessage(`Applied preset: ${presetName}`);
    }
    catch (error) {
        await vscode.window.showErrorMessage(`Failed to apply preset: ${presetName}`, 'Retry', 'Show Details').then(selection => {
            if (selection === 'Retry') {
                vscode.commands.executeCommand('aiTuner.applyPreset', presetName);
            }
            else if (selection === 'Show Details') {
                vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(JSON.stringify(error, null, 2)).toString('base64')}`));
            }
        });
    }
}
/**
 * Show performance report with enterprise-grade metrics
 * @param performanceMonitor - Performance monitor instance
 */
async function showPerformanceReport(performanceMonitor) {
    try {
        const summary = performanceMonitor.getPerformanceSummary();
        const report = `
AI Tuner Performance Report
==========================

Memory Statistics:
- Current Usage: ${(summary.memoryStats.used / 1024 / 1024).toFixed(2)} MB
- Peak Usage: ${(summary.memoryStats.peak / 1024 / 1024).toFixed(2)} MB
- Usage Percentage: ${summary.memoryStats.percentage.toFixed(2)}%

Memory Trend: ${summary.memoryTrend.trend}
Average Usage: ${(summary.memoryTrend.averageUsage / 1024 / 1024).toFixed(2)} MB

Memory Leak Check:
- Has Leak: ${summary.memoryLeakCheck.hasLeak ? 'Yes' : 'No'}
- Severity: ${summary.memoryLeakCheck.severity}
- Recommendation: ${summary.memoryLeakCheck.recommendation}

Operation Statistics:
- Total Operations: ${summary.operationCount}
- Average Operation Time: ${summary.averageOperationTime.toFixed(2)}ms

Performance Summary:
${Object.entries(summary.operationCount).map(([operation, stats]) => `- ${operation}: ${stats.average.toFixed(2)}ms avg (${stats.count} operations)`).join('\\n')}
    `.trim();
        const doc = await vscode.workspace.openTextDocument({
            content: report,
            language: 'plaintext'
        });
        await vscode.window.showTextDocument(doc);
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to generate performance report', 'Show Error Details').then(selection => {
            if (selection === 'Show Error Details') {
                vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(JSON.stringify(error, null, 2)).toString('base64')}`));
            }
        });
    }
}
/**
 * Show error report with enterprise-grade statistics
 * @param errorHandler - Error handler instance
 */
async function showErrorReport(errorHandler) {
    try {
        const stats = errorHandler.getErrorStatistics();
        const report = `
AI Tuner Error Report
=====================

Total Errors: ${stats.totalErrors}
Error Types: ${Object.keys(stats.errorTypes).length}

Error Breakdown:
${Object.entries(stats.errorTypes).map(([error, count]) => `- ${error}: ${count} occurrences`).join('\\n')}

Recovery Attempts:
${Object.entries(stats.recoveryAttempts).map(([operation, attempts]) => `- ${operation}: ${attempts} attempts`).join('\\n')}

Recent Errors:
${stats.recentErrors.map(error => `- ${error.error}: ${error.count} occurrences (last: ${error.lastOccurred.toISOString()})`).join('\\n')}
    `.trim();
        const doc = await vscode.workspace.openTextDocument({
            content: report,
            language: 'plaintext'
        });
        await vscode.window.showTextDocument(doc);
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to generate error report', 'Show Error Details').then(selection => {
            if (selection === 'Show Error Details') {
                vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(JSON.stringify(error, null, 2)).toString('base64')}`));
            }
        });
    }
}
/**
 * Export logs with enterprise-grade formatting
 * @param logger - Logger instance
 */
async function exportLogs(logger) {
    try {
        const fileUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file('ai-tuner-logs.json'),
            filters: {
                'JSON Files': ['json'],
                'All Files': ['*']
            }
        });
        if (fileUri) {
            await logger.exportLogs(fileUri.fsPath);
            await vscode.window.showInformationMessage(`Logs exported to: ${fileUri.fsPath}`);
        }
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to export logs', 'Show Error Details').then(selection => {
            if (selection === 'Show Error Details') {
                vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(JSON.stringify(error, null, 2)).toString('base64')}`));
            }
        });
    }
}
/**
 * Reset configuration with enterprise-grade validation
 * @param configurationValidator - Configuration validator instance
 * @param provider - AI Tuner provider instance
 */
async function resetConfiguration(configurationValidator, provider) {
    try {
        const result = await vscode.window.showWarningMessage('Are you sure you want to reset all AI Tuner configuration to defaults? This action cannot be undone.', 'Reset Configuration', 'Cancel');
        if (result === 'Reset Configuration') {
            const defaultSettings = configurationValidator.getDefaultSettings();
            await provider.updateSettings(defaultSettings);
            await vscode.window.showInformationMessage('Configuration reset to defaults successfully.');
        }
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to reset configuration', 'Show Error Details').then(selection => {
            if (selection === 'Show Error Details') {
                vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(JSON.stringify(error, null, 2)).toString('base64')}`));
            }
        });
    }
}
/**
 * Reload configuration with enterprise-grade error handling
 * @param extensionConfig - Extension configuration
 * @param logger - Logger instance
 * @param performanceMonitor - Performance monitor instance
 * @param errorHandler - Error handler instance
 * @param configurationValidator - Configuration validator instance
 */
async function reloadConfiguration(extensionConfig, logger, _performanceMonitor, _errorHandler, _configurationValidator) {
    try {
        // Reload configuration from VS Code settings
        const config = vscode.workspace.getConfiguration('aiTuner');
        extensionConfig.enablePerformanceMonitoring = config.get('enablePerformanceMonitoring', true);
        extensionConfig.enableDetailedLogging = config.get('enableDetailedLogging', true);
        extensionConfig.logLevel = config.get('logLevel', types_1.LogLevel.INFO);
        extensionConfig.enableErrorReporting = config.get('enableErrorReporting', true);
        extensionConfig.maxLogEntries = config.get('maxLogEntries', 1000);
        extensionConfig.enableMemoryMonitoring = config.get('enableMemoryMonitoring', true);
        logger.info('Configuration reloaded successfully', 'Extension', {
            newConfig: extensionConfig
        });
    }
    catch (error) {
        logger.error('Failed to reload configuration', 'Extension', error);
        throw error;
    }
}
/**
 * Toggle Elite mode for development testing
 * @param logger - Logger instance
 */
async function toggleEliteMode(logger) {
    try {
        const config = vscode.workspace.getConfiguration('aiTuner');
        const current = config.get('devElite', false);
        await config.update('devElite', !current, true);
        const status = !current ? 'enabled' : 'disabled';
        logger.info(`Elite mode ${status}`, 'Extension');
        await vscode.window.showInformationMessage(`Elite mode: ${status}`);
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to toggle Elite mode', 'Show Details').then(selection => {
            if (selection === 'Show Details') {
                logger.error('Failed to toggle Elite mode', 'Extension', error);
            }
        });
    }
}
/**
 * Reset blend counter for testing
 * @param context - VS Code extension context
 */
async function resetBlendCounter(context) {
    try {
        // Use globalState (Memento API) instead of localStorage
        await context.globalState.update('ai_tuner_blend_count', undefined);
        await context.globalState.update('ai_tuner_blend_reset_date', undefined);
        await vscode.window.showInformationMessage('Blend counter reset');
    }
    catch (error) {
        await vscode.window.showErrorMessage('Failed to reset blend counter', 'Show Details').then(selection => {
            if (selection === 'Show Details') {
                const logger = logger_1.Logger.getInstance();
                logger.error('Failed to reset blend counter', 'Extension', error);
            }
        });
    }
}
//# sourceMappingURL=extension.js.map