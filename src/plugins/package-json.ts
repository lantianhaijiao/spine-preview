/*
 * @Author: haobin.wang
 * @Date: 2024-04-30 09:20:44
 * @LastEditors: haobin.wang
 * @LastEditTime: 2024-04-30 18:57:27
 * @Description: Do not edit
 */
import * as vscode from "vscode";
export default async () => {
  console.log('111');
  const editor:any = vscode.window.activeTextEditor;
  const Uri = editor.document.uri; 
  const cursorPosition = editor.selection.active;

  const hover = await vscode.commands.executeCommand('vscode.executeHoverProvider', Uri, cursorPosition );
  console.log('hover', hover);
  let linkDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: "underline", // 为文本添加下划线
  });
  const c = vscode.commands.registerCommand("boast.package", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      // 判断是否为 package.json 文件
      if (document.fileName.endsWith("package.json")) {
        // 读取 package.json 内容
        const packageJson = JSON.parse(document.getText());
        // 确保有 devDependencies 对象
        if (packageJson.devDependencies) {
          let decorations = [];
          // 遍历 devDependencies 对象
          for (let dep in packageJson.devDependencies) {
            // 假设链接文本以 "http" 开始
            let match: any = dep.split(':');
            if (match) {
              let startPos = document.positionAt(match[0]);
              let endPos = document.positionAt(match[1]);
              let decoration = { range: new vscode.Range(startPos, endPos) };
              decorations.push(decoration);
            }
          }
          // 为符合条件的文本添加装饰
          editor.setDecorations(linkDecorationType, decorations);
        }
      }
    }
  });
  // vscode.window.onDidChangeTextEditorSelection((e) => {
  //   const editor = vscode.window.activeTextEditor;
  //   console.log('变了2', e.selections);
  //   if (editor && e.selections.length > 0) {
  //     const document = editor.document;
  //     console.log('文件', document.fileName);
  //     // 判断是否为 package.json 文件
  //     if (document.fileName.endsWith("package.json")) {
  //       console.log('进入判断了');
  //       const selection = e.selections[0];
  //       const selectedText = document.getText(selection);
  //       // 判断选中文本是否为链接
  //       vscode.env.openExternal(
  //         vscode.Uri.parse(`https://www.npmjs.com/package/${selectedText}`)
  //       );
  //     }
  //   }
  // });
  return c;
};
