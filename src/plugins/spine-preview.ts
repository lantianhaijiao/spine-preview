/*
 * @Author: haobin.wang
 * @Date: 2024-04-24 15:14:55
 * @LastEditors: haobin.wang
 * @LastEditTime: 2025-04-25 11:02:12
 * @Description: Do not edit
 */
import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");
import getSpineVersion, {qmCompareVersion} from "../utils/version";

const SPINE_FILES_EXT = [".json", ".atlas", ".png"];

export default (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    "spine.preview",
    async (uri) => {
      console.log("uri8", uri);
      // 获取文件大小
      vscode.window.showErrorMessage(uri);
      if (!uri) {
        vscode.window.showErrorMessage(`文件路径无效~ 请右键点击【播放spine】`);
        return;
      }
      // 获取文件的基本信息
      let filePath = uri.fsPath;
      const jsonFiles: string[] = [];
      const atlasFiles: string[] = [];

      // 遍历文件夹，找出 JSON 和 ATLAS 文件
      function traverseDir(dir: string, filename: string) {
        const files = fs.readdirSync(dir);
        files.forEach((file: any) => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          if (stats.isDirectory()) {
            traverseDir(filePath, filename);
          } else {
            if (filename && path.basename(filePath, path.extname(filePath)) !== filename) { return; }
            const ext = path.extname(file);
            if (ext === ".json") {
              jsonFiles.push(filePath);
            } else if (ext === ".atlas") {
              atlasFiles.push(filePath);
            }
          }
        });
      }
      console.log("filePath", filePath);
      const stats = fs.statSync(filePath);
      let filename = '';
      if (!stats.isDirectory()) {
        filename = path.basename(filePath, path.extname(filePath));
        filePath = path.dirname(filePath);
      }
      traverseDir(filePath, filename);
      // 简单选择第一个匹配的 JSON 和 ATLAS 文件（实际可优化为用户选择）
      const jsonPath = jsonFiles[0];
      const atlasPath = atlasFiles.find(
        (atlas) =>
          path.basename(atlas, ".atlas") === path.basename(jsonPath, ".json")
      );
      if (jsonPath && atlasPath) {
        const spineVersion = getSpineVersion(jsonPath);
        let webviewPanel: vscode.WebviewPanel | null = null;
        webviewPanel = vscode.window.createWebviewPanel(
          "spinePreview",
          "Spine Preview",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, "dist")),
              vscode.Uri.file(path.dirname(filePath)),
            ],
            retainContextWhenHidden: true
          }
        );
        // 将文件 URI 转为 Webview 可访问的路径
        const htmlPath = path.join(
          context.extensionPath,
          "dist/webview/index.html"
        );
        // console.log("htmlPath", htmlPath);
        const iconPath = vscode.Uri.file(path.join(context.extensionPath, 'dist/favicon.ico'));
        const iconWebviewUri = webviewPanel.webview.asWebviewUri(iconPath);
        const htmlContent = fs.readFileSync(htmlPath, "utf-8");
        const useSpineV8 = qmCompareVersion(String(spineVersion), '4.1') === 1;
        const fastDiffUri = webviewPanel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(context.extensionPath, `dist/webview/${useSpineV8 ? "pixi-v8" : "pixi"}.min.js`)
          )
        );
        const spineUri = webviewPanel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(
              context.extensionPath,
              `dist/webview/${useSpineV8 ? "spine-pixi-v8.min" : "pixi-spine"}.js`
            )
          )
        );
        let updatedHtmlContent = htmlContent;
        updatedHtmlContent = updatedHtmlContent.replaceAll(
          "./pixi.min.js",
          fastDiffUri.toString()
        );
        updatedHtmlContent = updatedHtmlContent.replaceAll(
          "./pixi-spine",
          spineUri.toString()
        );
        updatedHtmlContent = updatedHtmlContent.replaceAll(
          "/favicon.ico",
          iconWebviewUri.toString()
        );
        // 设置 Webview 内容
        webviewPanel.webview.html = updatedHtmlContent;
        // 存储 Webview Panel 引用
        const jsonUri = webviewPanel.webview.asWebviewUri(
          vscode.Uri.file(jsonPath)
        );
        const atlasUri = webviewPanel.webview.asWebviewUri(
          vscode.Uri.file(atlasPath)
        );

        // 读取 atlas 文件内容
        // const atlasContent = await readFile(atlasPath);
        // const modifiedAtlasContent = await modifyAtlasContent(
        //   atlasContent,
        //   webviewPanel,
        //   context
        // );

        // // 将修改后的 atlas 内容传递给 Webview
        // const modifiedAtlasBlob = new Blob([modifiedAtlasContent], {
        //   type: "text/plain",
        // });
        // const modifiedAtlasUrl = URL.createObjectURL(modifiedAtlasBlob);
        // 将文件内容发送到 Webview
        const noticeWebviewFile = () => {
          webviewPanel?.webview.postMessage({
            type: "loadFile",
            json: jsonUri.toString(),
            atlas: atlasUri.toString(),
            version: spineVersion,
            useSpineV8,
          });
        };
        noticeWebviewFile();
        // 处理自定义编辑器生命周期
        webviewPanel.onDidDispose(() => { // 关闭时清理
          webviewPanel = null;
        });
      } else {
        vscode.window.showErrorMessage(
          "在文件夹中未找到匹配的 Spine JSON 和 ATLAS 文件。"
        );
      }
    }
  );
  return disposable;
};
// 读取文件内容的辅助函数
async function readFile(filePath: string): Promise<string> {
  const fs = require("fs").promises;
  return await fs.readFile(filePath, "utf8");
}

// 修改 atlas 文件内容，替换 png 文件路径
async function modifyAtlasContent(
  atlasContent: string,
  webviewPanel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): Promise<string> {
  const pngRegex = /^([^\s]+)\.png$/gm;
  let match;
  while ((match = pngRegex.exec(atlasContent)) !== null) {
    const pngFileName = match[1];
    const pngPath = path.join(
      path.dirname(context.extensionPath),
      "dist/webview",
      `${pngFileName}.png`
    );
    const pngUri = webviewPanel.webview.asWebviewUri(vscode.Uri.file(pngPath));
    atlasContent = atlasContent.replace(
      `${pngFileName}.png`,
      pngUri.toString()
    );
  }
  return atlasContent;
}
