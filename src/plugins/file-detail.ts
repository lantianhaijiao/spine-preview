/*
 * @Author: haobin.wang
 * @Date: 2024-04-24 15:14:55
 * @LastEditors: haobin.wang
 * @LastEditTime: 2024-12-10 11:22:43
 * @Description: Do not edit
 */
import * as vscode from "vscode";
const fs = require("fs");
export default () => {
  let disposable = vscode.commands.registerCommand(
    "boast.fileDetail",
    (uri) => {
      console.log("uri8", uri);
      // 获取文件大小
      if (!uri) {
        vscode.window.showErrorMessage(`文件路径无效~ 请右键点击【文件详情】`);
        return;
      }
      // 获取文件的基本信息
      const filePath = uri.fsPath;
      // 使用 Node.js fs 模块获取文件信息
      fs.stat(filePath, (err: any, stats: any) => {
        if (err) {
          vscode.window.showErrorMessage(`无法获取文件信息: ${err}`);
          return;
        }
        if (stats.isDirectory()) {
          vscode.window.showWarningMessage(`请选择文件类型`);
          return;
        }

        // 获取文件的大小、创建时间、最后修改时间
        let fileSize = stats.size; // 文件大小以字节为单位
        let fileSizeDisplay = "";
        if (fileSize >= 1024 * 1024) {
          fileSizeDisplay = (fileSize / (1024 * 1024)).toFixed(2) + " MB";
        } else {
          fileSizeDisplay = (fileSize / 1024).toFixed(2) + " KB";
        }
        const birthTime = stats.birthtime.toLocaleString(); // 创建时间
        const modifiedTime = stats.mtime.toLocaleString(); // 最后修改时间
        const message = `文件路径: ${filePath}
          文件大小: ${fileSizeDisplay}
          创建时间: ${birthTime}
          最后修改时间: ${modifiedTime}`;

        vscode.window.showInformationMessage(message, { modal: true });
       
      });
    }
  );
  return disposable;
};