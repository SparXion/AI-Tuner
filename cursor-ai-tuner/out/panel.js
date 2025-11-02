"use strict";
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITunerPanel = void 0;
const vscode = __importStar(require("vscode"));
/**
 * AITunerPanel - Loads web version in iframe for single codebase
 * Currently using AITunerProvider's webview instead, but keeping this
 * as backup option if iframe approach is needed later
 */
class AITunerPanel {
    constructor(panel) {
        this._disposables = [];
        this._panel = panel;
        this._panel.webview.html = this._getWebviewContent();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    static createOrShow(_context) {
        const column = vscode.ViewColumn.Beside;
        if (AITunerPanel.currentPanel) {
            AITunerPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('aiTuner', 'AI Tuner', column, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.parse('https://cdn.jsdelivr.net'),
                vscode.Uri.parse('https://unpkg.com'),
                vscode.Uri.parse('https://sparxion.github.io')
            ]
        });
        AITunerPanel.currentPanel = new AITunerPanel(panel);
    }
    _getWebviewContent() {
        // Load web version from GitHub Pages (single codebase approach)
        const webAppUrl = 'https://sparxion.github.io/AI-Tuner/';
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';">
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: var(--vscode-font-family);
            background: var(--vscode-editor-background);
        }
        iframe {
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
</head>
<body>
    <iframe 
        src="${webAppUrl}" 
        allow="clipboard-read; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals">
    </iframe>
    <script>
        const vscode = acquireVsCodeApi();
        
        // Listen for messages from iframe
        window.addEventListener('message', (event) => {
            if (event.origin === '${webAppUrl.replace(/\/$/, '')}') {
                if (event.data.command) {
                    vscode.postMessage(event.data);
                }
            }
        });
    </script>
</body>
</html>`;
    }
    dispose() {
        AITunerPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const d = this._disposables.pop();
            if (d)
                d.dispose();
        }
    }
}
exports.AITunerPanel = AITunerPanel;
//# sourceMappingURL=panel.js.map