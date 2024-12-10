/*
 * @Author: haobin.wang
 * @Date: 2024-04-24 15:14:55
 * @LastEditors: haobin.wang
 * @LastEditTime: 2024-04-30 10:08:44
 * @Description: Do not edit
 */
import * as vscode from "vscode";
import { getEncourage } from '../tools/utils';
export default () => {
  const deleteConsole = vscode.commands.registerCommand('boast.deleteConsole', () => {
    const global = vscode.window;
    const editor = global.activeTextEditor;
    if (!editor) {
      return;
    }
    let editorText = editor.document.getText(editor.selection);
    if (!editorText) {
      global.showInformationMessage(`没选中东西别按我啊,算了鼓励一下你吧:${getEncourage()}`);
      return;
    }
    let deleteTimes = 0;
    editorText = editorText.replace(/\s+console.(log|warn|error)\((.*)\);?/g, (match) => {
      // deleteTimes = match.split('console.').length - 1;
      deleteTimes++;
      console.log('deleteTimes', deleteTimes);
      return "";
    });
    // 将文本信息进行正则替换，去掉console.xxx
    editor.edit((editBuilder) => {
      editBuilder.replace(editor.selection, editorText);
      global.showInformationMessage(`已删除${deleteTimes}个console.xxx`);
    });
  });
  return deleteConsole;
};