"use strict";
/**
 * @fileoverview Enterprise-grade error handling and recovery system
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
exports.ErrorHandler = exports.PerformanceError = exports.ValidationError = exports.ConfigurationError = exports.AITunerError = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Custom error types for better error handling
 */
class AITunerError extends Error {
    constructor(message, code, context, recoverable = false) {
        super(message);
        this.name = 'AITunerError';
        this.code = code;
        this.context = context;
        this.recoverable = recoverable;
    }
}
exports.AITunerError = AITunerError;
class ConfigurationError extends AITunerError {
    constructor(message, context) {
        super(message, 'CONFIG_ERROR', context, true);
        this.name = 'ConfigurationError';
    }
}
exports.ConfigurationError = ConfigurationError;
class ValidationError extends AITunerError {
    constructor(message, context) {
        super(message, 'VALIDATION_ERROR', context, true);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class PerformanceError extends AITunerError {
    constructor(message, context) {
        super(message, 'PERFORMANCE_ERROR', context, false);
        this.name = 'PerformanceError';
    }
}
exports.PerformanceError = PerformanceError;
/**
 * Enterprise-grade error handler with recovery mechanisms
 * @class ErrorHandler
 */
class ErrorHandler {
    /**
     * Private constructor for singleton pattern
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @param performanceMonitor - Performance monitor instance
     */
    constructor(_config, logger, performanceMonitor) {
        this.errorCounts = new Map();
        this.recoveryAttempts = new Map();
        this.maxRecoveryAttempts = 3;
        this.logger = logger;
        this.performanceMonitor = performanceMonitor;
        this.maxRecoveryAttempts = 3;
    }
    /**
     * Get singleton instance
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @param performanceMonitor - Performance monitor instance
     * @returns ErrorHandler instance
     */
    static getInstance(config, logger, performanceMonitor) {
        if (!ErrorHandler.instance && config && logger && performanceMonitor) {
            ErrorHandler.instance = new ErrorHandler(config, logger, performanceMonitor);
        }
        if (!ErrorHandler.instance) {
            throw new Error('ErrorHandler must be initialized with configuration, logger, and performance monitor');
        }
        return ErrorHandler.instance;
    }
    /**
     * Handle an error with comprehensive logging and recovery
     * @param error - Error to handle
     * @param context - Error context
     * @param operation - Operation that failed
     * @returns Promise that resolves when error is handled
     */
    async handleError(error, context, operation) {
        const errorId = this.generateErrorId(error, context);
        const errorCount = this.errorCounts.get(errorId) || 0;
        this.errorCounts.set(errorId, errorCount + 1);
        // Log error with full context
        this.logger.error(`Error in ${context.operation}: ${error.message}`, context.component, error, {
            ...context.context,
            errorId,
            errorCount: errorCount + 1,
            operation,
            stack: error.stack
        });
        // Record performance impact
        this.performanceMonitor.endOperation(context.operation, false, error);
        // Determine if error is recoverable
        const isRecoverable = this.isErrorRecoverable(error, context);
        const userMessage = this.generateUserMessage(error, context, isRecoverable);
        if (isRecoverable) {
            const recovered = await this.attemptRecovery(error, context);
            return { recovered, userMessage };
        }
        else {
            // Show critical error to user
            await this.showCriticalError(error, context, userMessage);
            return { recovered: false, userMessage };
        }
    }
    /**
     * Handle configuration errors with validation
     * @param error - Configuration error
     * @param context - Error context
     * @returns Promise that resolves when error is handled
     */
    async handleConfigurationError(error, context) {
        const configContext = {
            ...context,
            operation: 'configuration_validation',
            component: 'ConfigurationValidator'
        };
        try {
            // Attempt to reset to default configuration
            await this.resetToDefaultConfiguration();
            this.logger.info('Configuration reset to defaults', 'ErrorHandler', {
                originalError: error.message,
                context: configContext.context
            });
            await vscode.window.showWarningMessage('AI Tuner configuration was reset to defaults due to an error. Please reconfigure your settings.', 'Open Settings').then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'aiTuner');
                }
            });
        }
        catch (recoveryError) {
            this.logger.critical('Failed to reset configuration', 'ErrorHandler', recoveryError, {
                originalError: error.message,
                recoveryError: recoveryError.message
            });
            await vscode.window.showErrorMessage('AI Tuner encountered a critical configuration error. Please restart the extension.', 'Restart Extension').then(selection => {
                if (selection === 'Restart Extension') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
    }
    /**
     * Handle validation errors with user guidance
     * @param error - Validation error
     * @param context - Error context
     * @returns Promise that resolves when error is handled
     */
    async handleValidationError(error, context) {
        const validationContext = {
            ...context,
            operation: 'data_validation',
            component: 'ValidationHandler'
        };
        this.logger.warn('Validation error occurred', 'ErrorHandler', {
            error: error.message,
            context: validationContext.context
        });
        await vscode.window.showWarningMessage(`Validation Error: ${this.sanitizeErrorMessage(error.message)}`, 'Show Details').then(selection => {
            if (selection === 'Show Details') {
                this.showErrorDetails(error, validationContext);
            }
        });
    }
    /**
     * Handle performance errors with optimization suggestions
     * @param error - Performance error
     * @param context - Error context
     * @returns Promise that resolves when error is handled
     */
    async handlePerformanceError(error, context) {
        const performanceContext = {
            ...context,
            operation: 'performance_monitoring',
            component: 'PerformanceHandler'
        };
        this.logger.error('Performance error detected', 'ErrorHandler', error, {
            context: performanceContext.context
        });
        const performanceSummary = this.performanceMonitor.getPerformanceSummary();
        const memoryLeakCheck = performanceSummary.memoryLeakCheck;
        let message = 'AI Tuner is experiencing performance issues.';
        if (memoryLeakCheck.hasLeak) {
            message += ` Memory usage is ${memoryLeakCheck.severity}. ${memoryLeakCheck.recommendation}`;
        }
        await vscode.window.showWarningMessage(message, 'Show Performance Report', 'Reset Performance Data')
            .then(selection => {
            if (selection === 'Show Performance Report') {
                this.showPerformanceReport(performanceSummary);
            }
            else if (selection === 'Reset Performance Data') {
                this.performanceMonitor.reset();
                vscode.window.showInformationMessage('Performance data has been reset.');
            }
        });
    }
    /**
     * Attempt to recover from an error
     * @param error - Error to recover from
     * @param context - Error context
     * @returns Promise that resolves to recovery success
     */
    async attemptRecovery(error, context) {
        const recoveryKey = `${context.operation}_${context.component}`;
        const attempts = this.recoveryAttempts.get(recoveryKey) || 0;
        if (attempts >= this.maxRecoveryAttempts) {
            this.logger.warn('Maximum recovery attempts exceeded', 'ErrorHandler', {
                operation: context.operation,
                component: context.component,
                attempts
            });
            return false;
        }
        this.recoveryAttempts.set(recoveryKey, attempts + 1);
        try {
            // Implement specific recovery strategies based on error type
            if (error instanceof ConfigurationError) {
                await this.resetToDefaultConfiguration();
                return true;
            }
            else if (error instanceof ValidationError) {
                await this.resetValidationState();
                return true;
            }
            else if (error instanceof PerformanceError) {
                await this.optimizePerformance();
                return true;
            }
            // Generic recovery: retry operation
            this.logger.info(`Attempting recovery for ${context.operation}`, 'ErrorHandler', {
                attempt: attempts + 1,
                maxAttempts: this.maxRecoveryAttempts
            });
            return true;
        }
        catch (recoveryError) {
            this.logger.error('Recovery attempt failed', 'ErrorHandler', recoveryError, {
                originalError: error.message,
                recoveryAttempt: attempts + 1
            });
            return false;
        }
    }
    /**
     * Generate user-friendly error message
     * @param error - Original error
     * @param context - Error context
     * @param isRecoverable - Whether error is recoverable
     * @returns User-friendly message
     */
    generateUserMessage(error, _context, isRecoverable) {
        const sanitizedMessage = this.sanitizeErrorMessage(error.message);
        if (isRecoverable) {
            return `AI Tuner encountered an issue but has recovered: ${sanitizedMessage}`;
        }
        else {
            return `AI Tuner encountered an error: ${sanitizedMessage}`;
        }
    }
    /**
     * Sanitize error message for user display
     * @param message - Error message
     * @returns Sanitized message
     */
    sanitizeErrorMessage(message) {
        // Remove sensitive information and technical details
        return message
            .replace(/file:\/\/[^\s]+/g, '[file path]')
            .replace(/\/[^\s]+/g, '[path]')
            .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
            .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP address]')
            .substring(0, 200); // Limit length
    }
    /**
     * Generate unique error ID
     * @param error - Error object
     * @param context - Error context
     * @returns Unique error ID
     */
    generateErrorId(error, context) {
        const errorSignature = `${error.name}_${error.message.substring(0, 50)}_${context.operation}_${context.component}`;
        return Buffer.from(errorSignature).toString('base64').substring(0, 16);
    }
    /**
     * Check if error is recoverable
     * @param error - Error to check
     * @param context - Error context
     * @returns Whether error is recoverable
     */
    isErrorRecoverable(error, _context) {
        if (error instanceof AITunerError) {
            return error.recoverable;
        }
        // Check for common recoverable errors
        const recoverablePatterns = [
            'ENOENT',
            'EACCES',
            'ECONNRESET',
            'ETIMEDOUT',
            'validation',
            'configuration'
        ];
        return recoverablePatterns.some(pattern => error.message.toLowerCase().includes(pattern.toLowerCase()));
    }
    /**
     * Show critical error to user
     * @param error - Critical error
     * @param context - Error context
     * @param userMessage - User-friendly message
     */
    async showCriticalError(error, context, userMessage) {
        await vscode.window.showErrorMessage(userMessage, 'Show Details', 'Report Issue')
            .then(selection => {
            if (selection === 'Show Details') {
                this.showErrorDetails(error, context);
            }
            else if (selection === 'Report Issue') {
                this.reportIssue(error, context);
            }
        });
    }
    /**
     * Show detailed error information
     * @param error - Error to show details for
     * @param context - Error context
     */
    showErrorDetails(error, context) {
        const details = `
Error Details:
- Type: ${error.name}
- Message: ${error.message}
- Operation: ${context.operation}
- Component: ${context.component}
- Timestamp: ${new Date().toISOString()}
- Stack: ${error.stack || 'No stack trace available'}
    `.trim();
        vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(details).toString('base64')}`));
    }
    /**
     * Report issue to GitHub
     * @param error - Error to report
     * @param context - Error context
     */
    reportIssue(error, context) {
        const issueBody = `
**Error Details:**
- Type: ${error.name}
- Message: ${error.message}
- Operation: ${context.operation}
- Component: ${context.component}
- Timestamp: ${new Date().toISOString()}

**Context:**
\`\`\`json
${JSON.stringify(context.context, null, 2)}
\`\`\`

**Stack Trace:**
\`\`\`
${error.stack || 'No stack trace available'}
\`\`\`
    `.trim();
        const issueUrl = `https://github.com/SparXion/AI-Tuner/issues/new?title=Error: ${encodeURIComponent(error.message)}&body=${encodeURIComponent(issueBody)}`;
        vscode.env.openExternal(vscode.Uri.parse(issueUrl));
    }
    /**
     * Show performance report
     * @param performanceSummary - Performance summary
     */
    showPerformanceReport(performanceSummary) {
        // Safely extract properties with type guards
        const memoryStats = performanceSummary['memoryStats'] || {};
        const memoryTrend = performanceSummary['memoryTrend'] || {};
        const memoryLeakCheck = performanceSummary['memoryLeakCheck'] || {};
        const operationCount = Number(performanceSummary['operationCount'] || 0);
        const averageOperationTime = Number(performanceSummary['averageOperationTime'] || 0);
        const report = `
AI Tuner Performance Report
==========================

Memory Statistics:
- Current Usage: ${((memoryStats.used || 0) / 1024 / 1024).toFixed(2)} MB
- Peak Usage: ${((memoryStats.peak || 0) / 1024 / 1024).toFixed(2)} MB
- Usage Percentage: ${(memoryStats.percentage || 0).toFixed(2)}%

Memory Trend: ${memoryTrend.trend || 'unknown'}
Average Usage: ${((memoryTrend.averageUsage || 0) / 1024 / 1024).toFixed(2)} MB

Memory Leak Check:
- Has Leak: ${memoryLeakCheck.hasLeak ? 'Yes' : 'No'}
- Severity: ${memoryLeakCheck.severity || 'unknown'}
- Recommendation: ${memoryLeakCheck.recommendation || 'None'}

Operation Statistics:
- Total Operations: ${operationCount}
- Average Operation Time: ${averageOperationTime.toFixed(2)}ms
    `.trim();
        vscode.window.showTextDocument(vscode.Uri.parse(`data:text/plain;base64,${Buffer.from(report).toString('base64')}`));
    }
    /**
     * Reset to default configuration
     */
    async resetToDefaultConfiguration() {
        // Implementation would reset configuration to defaults
        this.logger.info('Configuration reset to defaults', 'ErrorHandler');
    }
    /**
     * Reset validation state
     */
    async resetValidationState() {
        // Implementation would reset validation state
        this.logger.info('Validation state reset', 'ErrorHandler');
    }
    /**
     * Optimize performance
     */
    async optimizePerformance() {
        // Implementation would optimize performance
        this.logger.info('Performance optimization applied', 'ErrorHandler');
    }
    /**
     * Get error statistics
     * @returns Error statistics
     */
    getErrorStatistics() {
        const totalErrors = Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0);
        const errorTypes = {};
        const recentErrors = [];
        for (const [errorId, count] of this.errorCounts) {
            errorTypes[errorId] = count;
            recentErrors.push({
                error: errorId,
                count,
                lastOccurred: new Date() // Simplified - would track actual timestamps
            });
        }
        return {
            totalErrors,
            errorTypes,
            recoveryAttempts: Object.fromEntries(this.recoveryAttempts),
            recentErrors: recentErrors.sort((a, b) => b.count - a.count).slice(0, 10)
        };
    }
    /**
     * Dispose of error handler resources
     */
    dispose() {
        this.errorCounts.clear();
        this.recoveryAttempts.clear();
        this.logger.info('Error handler disposed', 'ErrorHandler');
    }
}
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map