import * as vscode from 'vscode';

export class AITunerPanel {
  public static currentPanel: AITunerPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;

  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel) {
    this._panel = panel;
    this._panel.webview.html = this._getHtml();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow() {
    const column = vscode.ViewColumn.Beside;
    if (AITunerPanel.currentPanel) {
      AITunerPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'aiTuner',
      'AI Tuner Elite',
      column,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    AITunerPanel.currentPanel = new AITunerPanel(panel);
  }

  private _getHtml(): string {
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

  public dispose() {
    AITunerPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const d = this._disposables.pop();
      if (d) d.dispose();
    }
  }
}

