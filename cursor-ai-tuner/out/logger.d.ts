/**
 * @fileoverview Enterprise-grade logging system for AI Tuner Extension
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
import { LogEntry, ExtensionConfig } from './types';
/**
 * Enterprise-grade logger with performance monitoring and output channels
 * @class Logger
 */
export declare class Logger {
    private static instance;
    private outputChannel;
    private logLevel;
    private logEntries;
    private maxEntries;
    private performanceMetrics;
    /**
     * Private constructor for singleton pattern
     * @param config - Extension configuration
     */
    private constructor();
    /**
     * Get singleton instance
     * @param config - Extension configuration
     * @returns Logger instance
     */
    static getInstance(config?: ExtensionConfig): Logger;
    /**
     * Log a message with specified level
     * @param level - Log level
     * @param message - Log message
     * @param source - Source component
     * @param context - Additional context
     * @param error - Error object if applicable
     */
    private log;
    /**
     * Log debug message
     * @param message - Debug message
     * @param source - Source component
     * @param context - Additional context
     */
    debug(message: string, source: string, context?: Record<string, unknown>): void;
    /**
     * Log info message
     * @param message - Info message
     * @param source - Source component
     * @param context - Additional context
     */
    info(message: string, source: string, context?: Record<string, unknown>): void;
    /**
     * Log warning message
     * @param message - Warning message
     * @param source - Source component
     * @param context - Additional context
     */
    warn(message: string, source: string, context?: Record<string, unknown>): void;
    /**
     * Log error message
     * @param message - Error message
     * @param source - Source component
     * @param error - Error object
     * @param context - Additional context
     */
    error(message: string, source: string, error?: Error, context?: Record<string, unknown>): void;
    /**
     * Log critical error message
     * @param message - Critical error message
     * @param source - Source component
     * @param error - Error object
     * @param context - Additional context
     */
    critical(message: string, source: string, error?: Error, context?: Record<string, unknown>): void;
    /**
     * Record performance metric
     * @param operation - Operation name
     * @param duration - Duration in milliseconds
     */
    recordPerformance(operation: string, duration: number): void;
    /**
     * Get average performance for operation
     * @param operation - Operation name
     * @returns Average duration in milliseconds
     */
    getAveragePerformance(operation: string): number;
    /**
     * Get recent log entries
     * @param count - Number of entries to return
     * @returns Array of log entries
     */
    getRecentLogs(count?: number): LogEntry[];
    /**
     * Get performance metrics summary
     * @returns Performance metrics summary
     */
    getPerformanceSummary(): Record<string, {
        average: number;
        count: number;
        min: number;
        max: number;
    }>;
    /**
     * Clear all logs
     */
    clearLogs(): void;
    /**
     * Export logs to file
     * @param filePath - File path to export to
     */
    exportLogs(filePath: string): Promise<void>;
    /**
     * Trim log entries to maximum allowed
     */
    private trimLogEntries;
    /**
     * Dispose of logger resources
     */
    dispose(): void;
}
//# sourceMappingURL=logger.d.ts.map