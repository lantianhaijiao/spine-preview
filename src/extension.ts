/*
 * @Author: haobin.wang
 * @Date: 2024-12-17 11:43:12
 * @LastEditors: wangpan pan.wang@ushow.media
 * @LastEditTime: 2025-04-07 23:44:11
 * @Description: Do not edit
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FileDetail from './plugins/spine-preview';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
let fileSizeStatusBarItem: vscode.StatusBarItem;
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "spine-preview" is now active!');

  fileSizeStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('spine-preview.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Spine Preview!');
	});

	context.subscriptions.push(disposable);
  context.subscriptions.push(FileDetail(context));
}

// This method is called when your extension is deactivated
export function deactivate() {
  // 清理状态栏项
  if (fileSizeStatusBarItem) {
    fileSizeStatusBarItem.dispose();
  }
}
