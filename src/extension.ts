import * as vscode from 'vscode';
import { WebViewProvider } from "./webviewProvider";


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"fontChanger.webview",
			new WebViewProvider(context.extensionUri)
		)
	);
}

export function deactivate() {}
