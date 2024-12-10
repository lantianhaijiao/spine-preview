/*
 * @Author: haobin.wang
 * @Date: 2024-04-23 09:55:43
 * @LastEditors: haobin.wang
 * @LastEditTime: 2024-12-10 11:28:42
 * @Description: Do not edit
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import RemoveConsole from "./plugins/remove-console";
import Package from './plugins/package-json';
import FileDetail from './plugins/file-detail';
import RgbHex from "./plugins/rgb-hex";
import { getEncourage } from './tools/utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "boast" is now active!');
  const global = vscode.window;

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  
  // The commandId parameter must match the command field in package.json
  const boast = vscode.commands.registerCommand("boast.encourage", () => {
    const text = getEncourage();
    global.setStatusBarMessage(text);
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    global.showInformationMessage(text);
  });

  context.subscriptions.push(boast);
  context.subscriptions.push(RemoveConsole());
  context.subscriptions.push(FileDetail());
  context.subscriptions.push(RgbHex());
  context.subscriptions.push(await Package());
}

// This method is called when your extension is deactivated
export function deactivate() {}
