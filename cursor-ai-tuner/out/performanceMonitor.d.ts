/**
 * @fileoverview Enterprise-grade performance monitoring system
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
import { PerformanceMetrics, MemoryStats, ExtensionConfig } from './types';
import { Logger } from './logger';
/**
 * Enterprise-grade performance monitor with memory tracking
 * @class PerformanceMonitor
 */
export declare class PerformanceMonitor {
    private static instance;
    private logger;
    private memoryBaseline;
    private operationStartTimes;
    private memoryMeasurements;
    private isEnabled;
    /**
     * Private constructor for singleton pattern
     * @param config - Extension configuration
     * @param logger - Logger instance
     */
    private constructor();
    /**
     * Get singleton instance
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @returns PerformanceMonitor instance
     */
    static getInstance(config?: ExtensionConfig, logger?: Logger): PerformanceMonitor;
    /**
     * Start timing an operation
     * @param operationName - Name of the operation
     * @returns Operation ID for tracking
     */
    startOperation(operationName: string): string;
    /**
     * End timing an operation and record metrics
     * @param operationName - Name of the operation
     * @param success - Whether operation succeeded
     * @param error - Error if operation failed
     * @returns Performance metrics
     */
    endOperation(operationName: string, success?: boolean, error?: Error): PerformanceMetrics;
    /**
     * Measure memory usage
     * @returns Current memory statistics
     */
    measureMemory(): MemoryStats;
    /**
     * Get memory usage trend
     * @param windowSize - Number of recent measurements to analyze
     * @returns Memory trend analysis
     */
    getMemoryTrend(windowSize?: number): {
        trend: 'increasing' | 'decreasing' | 'stable';
        averageUsage: number;
        peakUsage: number;
        measurements: MemoryStats[];
    };
    /**
     * Check for memory leaks
     * @returns Memory leak analysis
     */
    checkMemoryLeaks(): {
        hasLeak: boolean;
        severity: 'low' | 'medium' | 'high';
        recommendation: string;
        trend: ReturnType<PerformanceMonitor['getMemoryTrend']>;
    };
    /**
     * Get performance summary
     * @returns Comprehensive performance summary
     */
    getPerformanceSummary(): {
        memoryStats: MemoryStats;
        memoryTrend: ReturnType<PerformanceMonitor['getMemoryTrend']>;
        memoryLeakCheck: ReturnType<PerformanceMonitor['checkMemoryLeaks']>;
        operationCount: number;
        averageOperationTime: number;
    };
    /**
     * Get current memory usage (simplified implementation)
     * @returns Memory usage in bytes
     */
    private getCurrentMemoryUsage;
    /**
     * Get available memory (simplified implementation)
     * @returns Available memory in bytes
     */
    private getAvailableMemory;
    /**
     * Get peak memory usage
     * @returns Peak memory usage in bytes
     */
    private getPeakMemoryUsage;
    /**
     * Reset performance monitoring
     */
    reset(): void;
    /**
     * Dispose of performance monitor resources
     */
    dispose(): void;
}
//# sourceMappingURL=performanceMonitor.d.ts.map