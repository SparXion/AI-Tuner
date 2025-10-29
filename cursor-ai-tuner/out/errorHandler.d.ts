/**
 * @fileoverview Enterprise-grade error handling and recovery system
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
import { ErrorContext, ExtensionConfig } from './types';
import { Logger } from './logger';
import { PerformanceMonitor } from './performanceMonitor';
/**
 * Custom error types for better error handling
 */
export declare class AITunerError extends Error {
    readonly code: string;
    readonly context: ErrorContext;
    readonly recoverable: boolean;
    constructor(message: string, code: string, context: ErrorContext, recoverable?: boolean);
}
export declare class ConfigurationError extends AITunerError {
    constructor(message: string, context: ErrorContext);
}
export declare class ValidationError extends AITunerError {
    constructor(message: string, context: ErrorContext);
}
export declare class PerformanceError extends AITunerError {
    constructor(message: string, context: ErrorContext);
}
/**
 * Enterprise-grade error handler with recovery mechanisms
 * @class ErrorHandler
 */
export declare class ErrorHandler {
    private static instance;
    private logger;
    private performanceMonitor;
    private errorCounts;
    private recoveryAttempts;
    private maxRecoveryAttempts;
    /**
     * Private constructor for singleton pattern
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @param performanceMonitor - Performance monitor instance
     */
    private constructor();
    /**
     * Get singleton instance
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @param performanceMonitor - Performance monitor instance
     * @returns ErrorHandler instance
     */
    static getInstance(config?: ExtensionConfig, logger?: Logger, performanceMonitor?: PerformanceMonitor): ErrorHandler;
    /**
     * Handle an error with comprehensive logging and recovery
     * @param error - Error to handle
     * @param context - Error context
     * @param operation - Operation that failed
     * @returns Promise that resolves when error is handled
     */
    handleError(error: Error, context: ErrorContext, operation?: string): Promise<{
        recovered: boolean;
        userMessage: string;
    }>;
    /**
     * Handle configuration errors with validation
     * @param error - Configuration error
     * @param context - Error context
     * @returns Promise that resolves when error is handled
     */
    handleConfigurationError(error: Error, context: ErrorContext): Promise<void>;
    /**
     * Handle validation errors with user guidance
     * @param error - Validation error
     * @param context - Error context
     * @returns Promise that resolves when error is handled
     */
    handleValidationError(error: Error, context: ErrorContext): Promise<void>;
    /**
     * Handle performance errors with optimization suggestions
     * @param error - Performance error
     * @param context - Error context
     * @returns Promise that resolves when error is handled
     */
    handlePerformanceError(error: Error, context: ErrorContext): Promise<void>;
    /**
     * Attempt to recover from an error
     * @param error - Error to recover from
     * @param context - Error context
     * @returns Promise that resolves to recovery success
     */
    private attemptRecovery;
    /**
     * Generate user-friendly error message
     * @param error - Original error
     * @param context - Error context
     * @param isRecoverable - Whether error is recoverable
     * @returns User-friendly message
     */
    private generateUserMessage;
    /**
     * Sanitize error message for user display
     * @param message - Error message
     * @returns Sanitized message
     */
    private sanitizeErrorMessage;
    /**
     * Generate unique error ID
     * @param error - Error object
     * @param context - Error context
     * @returns Unique error ID
     */
    private generateErrorId;
    /**
     * Check if error is recoverable
     * @param error - Error to check
     * @param context - Error context
     * @returns Whether error is recoverable
     */
    private isErrorRecoverable;
    /**
     * Show critical error to user
     * @param error - Critical error
     * @param context - Error context
     * @param userMessage - User-friendly message
     */
    private showCriticalError;
    /**
     * Show detailed error information
     * @param error - Error to show details for
     * @param context - Error context
     */
    private showErrorDetails;
    /**
     * Report issue to GitHub
     * @param error - Error to report
     * @param context - Error context
     */
    private reportIssue;
    /**
     * Show performance report
     * @param performanceSummary - Performance summary
     */
    private showPerformanceReport;
    /**
     * Reset to default configuration
     */
    private resetToDefaultConfiguration;
    /**
     * Reset validation state
     */
    private resetValidationState;
    /**
     * Optimize performance
     */
    private optimizePerformance;
    /**
     * Get error statistics
     * @returns Error statistics
     */
    getErrorStatistics(): {
        totalErrors: number;
        errorTypes: Record<string, number>;
        recoveryAttempts: Record<string, number>;
        recentErrors: Array<{
            error: string;
            count: number;
            lastOccurred: Date;
        }>;
    };
    /**
     * Dispose of error handler resources
     */
    dispose(): void;
}
//# sourceMappingURL=errorHandler.d.ts.map