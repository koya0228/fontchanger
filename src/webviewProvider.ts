import * as vscode from "vscode";
import { newFontset } from "./fontFunction";


export class WebViewProvider implements vscode.WebviewViewProvider {
  constructor(private extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    const scriptUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "public", "index.js")
    );


    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case "new-font":
          newFontset(message.target, message.fonts);
          break;
      }
    });


    webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>WebView Example</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="${scriptUri}" />
        </body>
      </html>
    `;
  }
}
