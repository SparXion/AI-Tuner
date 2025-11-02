import * as vscode from 'vscode';
/**
 * AITunerPanel - Loads web version in iframe for single codebase
 * Currently using AITunerProvider's webview instead, but keeping this
 * as backup option if iframe approach is needed later
 */
export declare class AITunerPanel {
    static currentPanel: AITunerPanel | undefined;
    private readonly _panel;
    private _disposables;
    private constructor();
    static createOrShow(_context: vscode.ExtensionContext): void;
    private _getWebviewContent;
    dispose(): void;
}
//# sourceMappingURL=panel.d.ts.map