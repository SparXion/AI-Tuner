/**
 * @fileoverview Enterprise-grade configuration validation and management system
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
import { AITunerSettings, ValidationResult, ExtensionConfig, PresetConfig } from './types';
import { Logger } from './logger';
import { ErrorHandler } from './errorHandler';
/**
 * Comprehensive configuration validator with type safety and fallbacks
 * @class ConfigurationValidator
 */
export declare class ConfigurationValidator {
    private static instance;
    private logger;
    private errorHandler;
    /**
     * Private constructor for singleton pattern
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @param errorHandler - Error handler instance
     */
    private constructor();
    /**
     * Get singleton instance
     * @param config - Extension configuration
     * @param logger - Logger instance
     * @param errorHandler - Error handler instance
     * @returns ConfigurationValidator instance
     */
    static getInstance(config?: ExtensionConfig, logger?: Logger, errorHandler?: ErrorHandler): ConfigurationValidator;
    /**
     * Validate AI Tuner settings with comprehensive checks
     * @param settings - Settings to validate
     * @param source - Source of settings (user input, file, etc.)
     * @returns Validation result
     */
    validateSettings(settings: Partial<AITunerSettings>, source?: string): ValidationResult;
    /**
     * Validate logical consistency of settings
     * @param settings - Settings to validate
     * @param warnings - Warnings array to populate
     */
    private validateLogicalConsistency;
    /**
     * Check for missing required fields
     * @param settings - Settings to check
     * @returns Array of missing field names
     */
    private checkCompleteness;
    /**
     * Sanitize user input to prevent injection attacks
     * @param input - User input to sanitize
     * @returns Sanitized input
     */
    sanitizeInput(input: string): string;
    /**
     * Validate preset configuration
     * @param preset - Preset to validate
     * @returns Validation result
     */
    validatePreset(preset: Partial<PresetConfig>): ValidationResult<PresetConfig>;
    /**
     * Validate extension configuration
     * @param config - Extension configuration to validate
     * @returns Validation result
     */
    validateExtensionConfig(config: Partial<ExtensionConfig>): ValidationResult<ExtensionConfig>;
    /**
     * Get default settings with validation
     * @returns Default validated settings
     */
    getDefaultSettings(): AITunerSettings;
    /**
     * Dispose of configuration validator resources
     */
    dispose(): void;
}
//# sourceMappingURL=configurationValidator.d.ts.map