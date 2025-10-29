/**
 * @fileoverview Enterprise-grade AI Tuner Provider with comprehensive monitoring and error handling
 * @author SparXion
 * @version 2.0.0
 * @license Apache-2.0
 */
import * as vscode from 'vscode';
import { AITunerSettings } from './types';
/**
 * Enterprise-grade AI Tuner Provider with comprehensive monitoring
 * @class AITunerProvider
 */
export declare class AITunerProvider implements vscode.TreeDataProvider<AITunerItem> {
    private static instance;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<AITunerItem | undefined | null | void>;
    private logger;
    private performanceMonitor;
    private errorHandler;
    private configurationValidator;
    private extensionConfig;
    private webviewPanel;
    private currentSettings;
    private customPresets;
    /**
     * Private constructor for singleton pattern
     * @param _context - VS Code extension context
     */
    private constructor();
    /**
     * Get singleton instance
     * @param context - VS Code extension context
     * @returns AITunerProvider instance
     */
    static getInstance(context?: vscode.ExtensionContext): AITunerProvider;
    /**
     * Initialize extension configuration with enterprise-grade defaults
     * @returns Extension configuration
     */
    private initializeExtensionConfig;
    /**
     * Load custom presets with enterprise-grade validation
     */
    private loadCustomPresets;
    /**
     * Update settings with enterprise-grade validation and error handling
     * @param newSettings - New settings to apply
     */
    updateSettings(newSettings: Partial<AITunerSettings>): Promise<void>;
    /**
     * Apply preset with enterprise-grade validation
     * @param presetName - Name of preset to apply
     */
    applyPreset(presetName: string): Promise<void>;
    /**
     * Update webview with current settings
     */
    private updateWebview;
    /**
     * Get tree item for VS Code tree view
     * @param element - Tree item element
     * @returns VS Code tree item
     */
    getTreeItem(element: AITunerItem): vscode.TreeItem;
    /**
     * Get children for tree view
     * @param element - Parent element
     * @returns Array of child elements
     */
    getChildren(element?: AITunerItem): Thenable<AITunerItem[]>;
    /**
     * Refresh tree view
     */
    refresh(): void;
    /**
     * Create webview panel with enterprise-grade security and error handling
     * @param context - VS Code extension context
     * @returns Webview panel
     */
    createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel;
    /**
     * Handle webview messages with enterprise-grade validation and security
     * @param message - Message from webview
     */
    private handleWebviewMessage;
    /**
     * Get webview content with enterprise-grade security and exact web app matching
     * @returns HTML content for webview
     */
    private getWebviewContent;
    /**
     * Dispose of provider resources with enterprise-grade cleanup
     */
    dispose(): void;
}
/**
 * Tree item for VS Code tree view
 * @class AITunerItem
 */
export declare class AITunerItem extends vscode.TreeItem {
    readonly label: string;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    readonly command: vscode.Command;
    readonly tooltip?: string | undefined;
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, command: vscode.Command, tooltip?: string | undefined);
}
//# sourceMappingURL=aiTunerProvider.d.ts.map