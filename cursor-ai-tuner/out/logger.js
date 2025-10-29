"use strict";
/**
 * @fileoverview Enterprise-grade logging system for AI Tuner Extension
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
exports.Logger = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("./types");
/**
 * Enterprise-grade logger with performance monitoring and output channels
 * @class Logger
 */
class Logger {
    /**
     * Private constructor for singleton pattern
     * @param config - Extension configuration
     */
    constructor(config) {
        this.logEntries = [];
        this.performanceMetrics = new Map();
        this.outputChannel = vscode.window.createOutputChannel('AI Tuner');
        this.logLevel = config.logLevel;
        this.maxEntries = config.maxLogEntries;
    }
    /**
     * Get singleton instance
     * @param config - Extension configuration
     * @returns Logger instance
     */
    static getInstance(config) {
        if (!Logger.instance && config) {
            Logger.instance = new Logger(config);
        }
        if (!Logger.instance) {
            throw new Error('Logger must be initialized with configuration');
        }
        return Logger.instance;
    }
    /**
     * Log a message with specified level
     * @param level - Log level
     * @param message - Log message
     * @param source - Source component
     * @param context - Additional context
     * @param error - Error object if applicable
     */
    log(level, message, source, context, error) {
        if (level < this.logLevel) {
            return;
        }
        const logEntry = {
            timestamp: new Date(),
            level,
            message,
            context: context ?? {},
            source,
            error: error ?? undefined
        };
        this.logEntries.push(logEntry);
        this.trimLogEntries();
        const levelName = types_1.LogLevel[level];
        const timestamp = logEntry.timestamp.toISOString();
        const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
        const errorStr = error ? ` | Error: ${error.message}` : '';
        const logMessage = `[${timestamp}] ${levelName} | ${source} | ${message}${contextStr}${errorStr}`;
        this.outputChannel.appendLine(logMessage);
        // Show critical errors to user
        if (level >= types_1.LogLevel.CRITICAL) {
            vscode.window.showErrorMessage(`AI Tuner Critical Error: ${message}`);
        }
    }
    /**
     * Log debug message
     * @param message - Debug message
     * @param source - Source component
     * @param context - Additional context
     */
    debug(message, source, context) {
        this.log(types_1.LogLevel.DEBUG, message, source, context);
    }
    /**
     * Log info message
     * @param message - Info message
     * @param source - Source component
     * @param context - Additional context
     */
    info(message, source, context) {
        this.log(types_1.LogLevel.INFO, message, source, context);
    }
    /**
     * Log warning message
     * @param message - Warning message
     * @param source - Source component
     * @param context - Additional context
     */
    warn(message, source, context) {
        this.log(types_1.LogLevel.WARN, message, source, context);
    }
    /**
     * Log error message
     * @param message - Error message
     * @param source - Source component
     * @param error - Error object
     * @param context - Additional context
     */
    error(message, source, error, context) {
        this.log(types_1.LogLevel.ERROR, message, source, context, error);
    }
    /**
     * Log critical error message
     * @param message - Critical error message
     * @param source - Source component
     * @param error - Error object
     * @param context - Additional context
     */
    critical(message, source, error, context) {
        this.log(types_1.LogLevel.CRITICAL, message, source, context, error);
    }
    /**
     * Record performance metric
     * @param operation - Operation name
     * @param duration - Duration in milliseconds
     */
    recordPerformance(operation, duration) {
        if (!this.performanceMetrics.has(operation)) {
            this.performanceMetrics.set(operation, []);
        }
        const metrics = this.performanceMetrics.get(operation);
        metrics.push(duration);
        // Keep only last 100 measurements
        if (metrics.length > 100) {
            metrics.shift();
        }
        this.debug(`Performance: ${operation} took ${duration}ms`, 'PerformanceMonitor', {
            operation,
            duration,
            average: this.getAveragePerformance(operation)
        });
    }
    /**
     * Get average performance for operation
     * @param operation - Operation name
     * @returns Average duration in milliseconds
     */
    getAveragePerformance(operation) {
        const metrics = this.performanceMetrics.get(operation);
        if (!metrics || metrics.length === 0) {
            return 0;
        }
        return metrics.reduce((sum, duration) => sum + duration, 0) / metrics.length;
    }
    /**
     * Get recent log entries
     * @param count - Number of entries to return
     * @returns Array of log entries
     */
    getRecentLogs(count = 50) {
        return this.logEntries.slice(-count);
    }
    /**
     * Get performance metrics summary
     * @returns Performance metrics summary
     */
    getPerformanceSummary() {
        const summary = {};
        for (const [operation, metrics] of this.performanceMetrics) {
            if (metrics.length > 0) {
                summary[operation] = {
                    average: metrics.reduce((sum, duration) => sum + duration, 0) / metrics.length,
                    count: metrics.length,
                    min: Math.min(...metrics),
                    max: Math.max(...metrics)
                };
            }
        }
        return summary;
    }
    /**
     * Clear all logs
     */
    clearLogs() {
        this.logEntries = [];
        this.outputChannel.clear();
        this.info('Logs cleared', 'Logger');
    }
    /**
     * Export logs to file
     * @param filePath - File path to export to
     */
    async exportLogs(filePath) {
        try {
            const logData = {
                exportedAt: new Date().toISOString(),
                logLevel: types_1.LogLevel[this.logLevel],
                entries: this.logEntries,
                performanceSummary: this.getPerformanceSummary()
            };
            await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(JSON.stringify(logData, null, 2)));
            this.info(`Logs exported to ${filePath}`, 'Logger', { filePath, entryCount: this.logEntries.length });
        }
        catch (error) {
            this.error('Failed to export logs', 'Logger', error, { filePath });
            throw error;
        }
    }
    /**
     * Trim log entries to maximum allowed
     */
    trimLogEntries() {
        if (this.logEntries.length > this.maxEntries) {
            this.logEntries = this.logEntries.slice(-this.maxEntries);
        }
    }
    /**
     * Dispose of logger resources
     */
    dispose() {
        this.outputChannel.dispose();
        this.logEntries = [];
        this.performanceMetrics.clear();
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map