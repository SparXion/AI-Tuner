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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITunerPanel = void 0;
const vscode = __importStar(require("vscode"));
class AITunerPanel {
    constructor(panel) {
        this._disposables = [];
        this._panel = panel;
        this._panel.webview.html = this._getHtml();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    static createOrShow() {
        const column = vscode.ViewColumn.Beside;
        if (AITunerPanel.currentPanel) {
            AITunerPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('aiTuner', 'AI Tuner Elite', column, { enableScripts: true, retainContextWhenHidden: true });
        AITunerPanel.currentPanel = new AITunerPanel(panel);
    }
    _getHtml() {
        return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: var(--vscode-font-family); padding: 20px; background: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
    .locked { text-align: center; padding: 40px; border: 2px dashed #555; border-radius: 10px; margin: 20px 0; }
    a { color: #58a6ff; text-decoration: none; }
    button { padding: 8px 16px; margin: 5px; }
  </style>
</head>
<body>
  <div class="locked">
    <h2>Elite Feature</h2>
    <p>Unlock in-Cursor tuning + Auto-Apply</p>
    <p><a href="https://app.aituner.com" target="_blank">Upgrade to Elite →</a></p>
  </div>
  <div id="tuner-root"></div>
  <script>
    const vscode = acquireVsCodeApi();
    // Future: load web tuner here when Elite
  </script>
</body>
</html>
    `;
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