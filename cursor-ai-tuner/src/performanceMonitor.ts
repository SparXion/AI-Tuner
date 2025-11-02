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
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private logger: Logger;
  private memoryBaseline: number = 0;
  private operationStartTimes: Map<string, number> = new Map();
  private memoryMeasurements: MemoryStats[] = [];
  private isEnabled: boolean;

  /**
   * Private constructor for singleton pattern
   * @param config - Extension configuration
   * @param logger - Logger instance
   */
  private constructor(config: ExtensionConfig, logger: Logger) {
    this.logger = logger;
    this.isEnabled = config.enablePerformanceMonitoring;
    this.memoryBaseline = this.getCurrentMemoryUsage();
    
    if (this.isEnabled) {
      this.logger.info('Performance monitoring enabled', 'PerformanceMonitor');
    }
  }

  /**
   * Get singleton instance
   * @param config - Extension configuration
   * @param logger - Logger instance
   * @returns PerformanceMonitor instance
   */
  public static getInstance(config?: ExtensionConfig, logger?: Logger): PerformanceMonitor {
    if (!PerformanceMonitor.instance && config && logger) {
      PerformanceMonitor.instance = new PerformanceMonitor(config, logger);
    }
    if (!PerformanceMonitor.instance) {
      throw new Error('PerformanceMonitor must be initialized with configuration and logger');
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start timing an operation
   * @param operationName - Name of the operation
   * @returns Operation ID for tracking
   */
  public startOperation(operationName: string): string {
    if (!this.isEnabled) {
      return operationName;
    }

    const startTime = performance.now();
    const memoryStart = this.getCurrentMemoryUsage();
    
    this.operationStartTimes.set(operationName, startTime);
    
    this.logger.debug(`Started operation: ${operationName}`, 'PerformanceMonitor', {
      operation: operationName,
      startTime,
      memoryStart
    });

    return operationName;
  }

  /**
   * End timing an operation and record metrics
   * @param operationName - Name of the operation
   * @param success - Whether operation succeeded
   * @param error - Error if operation failed
   * @returns Performance metrics
   */
  public endOperation(operationName: string, success: boolean = true, error?: Error): PerformanceMetrics {
    if (!this.isEnabled) {
      return {
        startTime: 0,
        endTime: 0,
        duration: 0,
        memoryStart: 0,
        memoryEnd: 0,
        memoryDelta: 0,
        operation: operationName,
        success,
        error: error?.message ?? undefined
      };
    }

    const endTime = performance.now();
    const startTime = this.operationStartTimes.get(operationName);
    const memoryEnd = this.getCurrentMemoryUsage();
    
    if (!startTime) {
      this.logger.warn(`No start time found for operation: ${operationName}`, 'PerformanceMonitor');
      return {
        startTime: 0,
        endTime,
        duration: 0,
        memoryStart: 0,
        memoryEnd,
        memoryDelta: 0,
        operation: operationName,
        success: false,
        error: 'No start time recorded'
      };
    }

    const duration = endTime - startTime;
    const memoryStart = this.getCurrentMemoryUsage(); // Simplified for now
    const memoryDelta = memoryEnd - memoryStart;

    const metrics: PerformanceMetrics = {
      startTime,
      endTime,
      duration,
      memoryStart,
      memoryEnd,
      memoryDelta,
      operation: operationName,
      success,
      error: error?.message ?? undefined
    };

    this.operationStartTimes.delete(operationName);
    this.logger.recordPerformance(operationName, duration);

    if (duration > 1000) { // Log slow operations
      this.logger.warn(`Slow operation detected: ${operationName}`, 'PerformanceMonitor', {
        duration,
        memoryDelta,
        success
      });
    }

    this.logger.debug(`Completed operation: ${operationName}`, 'PerformanceMonitor', {
      duration,
      memoryDelta,
      success
    });

    return metrics;
  }

  /**
   * Measure memory usage
   * @returns Current memory statistics
   */
  public measureMemory(): MemoryStats {
    const used = this.getCurrentMemoryUsage();
    const available = this.getAvailableMemory();
    const percentage = (used / (used + available)) * 100;

    const stats: MemoryStats = {
      used,
      available,
      percentage,
      peak: this.getPeakMemoryUsage(),
      timestamp: new Date()
    };

    this.memoryMeasurements.push(stats);
    
    // Keep only last 50 measurements to reduce memory usage
    if (this.memoryMeasurements.length > 50) {
      this.memoryMeasurements.shift();
    }

    return stats;
  }

  /**
   * Get memory usage trend
   * @param windowSize - Number of recent measurements to analyze
   * @returns Memory trend analysis
   */
  public getMemoryTrend(windowSize: number = 10): {
    trend: 'increasing' | 'decreasing' | 'stable';
    averageUsage: number;
    peakUsage: number;
    measurements: MemoryStats[];
  } {
    const recentMeasurements = this.memoryMeasurements.slice(-windowSize);
    
    if (recentMeasurements.length < 2) {
      return {
        trend: 'stable',
        averageUsage: this.getCurrentMemoryUsage(),
        peakUsage: this.getCurrentMemoryUsage(),
        measurements: recentMeasurements
      };
    }

    const first = recentMeasurements[0]?.used ?? 0;
    const last = recentMeasurements[recentMeasurements.length - 1]?.used ?? 0;
    const averageUsage = recentMeasurements.reduce((sum, m) => sum + m.used, 0) / recentMeasurements.length;
    const peakUsage = Math.max(...recentMeasurements.map(m => m.used));

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    const threshold = averageUsage * 0.1; // 10% threshold

    if (last > first + threshold) {
      trend = 'increasing';
    } else if (last < first - threshold) {
      trend = 'decreasing';
    }

    return {
      trend,
      averageUsage,
      peakUsage,
      measurements: recentMeasurements
    };
  }

  /**
   * Check for memory leaks
   * @returns Memory leak analysis
   */
  public checkMemoryLeaks(): {
    hasLeak: boolean;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
    trend: ReturnType<PerformanceMonitor['getMemoryTrend']>;
  } {
    const trend = this.getMemoryTrend(10); // Reduced from 20 to 10 measurements
    // More conservative threshold to reduce false positives
    const hasLeak = trend.trend === 'increasing' && trend.averageUsage > this.memoryBaseline * 2.0;
    
    let severity: 'low' | 'medium' | 'high' = 'low';
    let recommendation = 'Memory usage is normal';

    if (hasLeak) {
      const increasePercentage = ((trend.averageUsage - this.memoryBaseline) / this.memoryBaseline) * 100;
      
      if (increasePercentage > 100) {
        severity = 'high';
        recommendation = 'Critical memory leak detected. Consider restarting the extension.';
      } else if (increasePercentage > 50) {
        severity = 'medium';
        recommendation = 'Moderate memory increase detected. Monitor usage closely.';
      } else {
        severity = 'low';
        recommendation = 'Minor memory increase detected. Monitor usage.';
      }
    }

    return {
      hasLeak,
      severity,
      recommendation,
      trend
    };
  }

  /**
   * Get performance summary
   * @returns Comprehensive performance summary
   */
  public getPerformanceSummary(): {
    memoryStats: MemoryStats;
    memoryTrend: ReturnType<PerformanceMonitor['getMemoryTrend']>;
    memoryLeakCheck: ReturnType<PerformanceMonitor['checkMemoryLeaks']>;
    operationCount: number;
    averageOperationTime: number;
  } {
    const memoryStats = this.measureMemory();
    const memoryTrend = this.getMemoryTrend();
    const memoryLeakCheck = this.checkMemoryLeaks();
    
    const operationCount = this.logger.getPerformanceSummary();
    const totalOperations = Object.values(operationCount).reduce((sum, op) => sum + op.count, 0);
    const averageOperationTime = totalOperations > 0 
      ? Object.values(operationCount).reduce((sum, op) => sum + (op.average * op.count), 0) / totalOperations
      : 0;

    return {
      memoryStats,
      memoryTrend,
      memoryLeakCheck,
      operationCount: totalOperations,
      averageOperationTime
    };
  }

  /**
   * Get current memory usage (simplified implementation)
   * @returns Memory usage in bytes
   */
  private getCurrentMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }

  /**
   * Get available memory (simplified implementation)
   * @returns Available memory in bytes
   */
  private getAvailableMemory(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      return memUsage.heapTotal - memUsage.heapUsed;
    }
    return 1024 * 1024 * 100; // Default 100MB
  }

  /**
   * Get peak memory usage
   * @returns Peak memory usage in bytes
   */
  private getPeakMemoryUsage(): number {
    if (this.memoryMeasurements.length === 0) {
      return this.getCurrentMemoryUsage();
    }
    return Math.max(...this.memoryMeasurements.map(m => m.used));
  }

  /**
   * Reset performance monitoring
   */
  public reset(): void {
    this.operationStartTimes.clear();
    this.memoryMeasurements = [];
    this.memoryBaseline = this.getCurrentMemoryUsage();
    this.logger.info('Performance monitoring reset', 'PerformanceMonitor');
  }

  /**
   * Dispose of performance monitor resources
   */
  public dispose(): void {
    this.operationStartTimes.clear();
    this.memoryMeasurements = [];
    this.logger.info('Performance monitor disposed', 'PerformanceMonitor');
  }
}
