/*
 * @Author: haobin.wang
 * @Date: 2024-04-24 15:14:55
 * @LastEditors: haobin.wang
 * @LastEditTime: 2024-12-10 11:45:24
 * @Description: Do not edit
 */
import * as vscode from "vscode";
export default () => {
  const deleteConsole = vscode.commands.registerCommand('boast.rgbHex', () => {
    const global = vscode.window;
    const editor = global.activeTextEditor;
    if (!editor) {
      return;
    }
    let editorText = editor.document.getText(editor.selection);
    if (!editorText) {
      global.showInformationMessage(`没选中东西别按我啊~`);
      return;
    }
    editorText = colorConverter(editorText, (err: string) => {
      global.showInformationMessage(err);
    });
    // 将文本信息进行正则替换，去掉console.xxx
    editor.edit((editBuilder) => {
      editBuilder.replace(editor.selection, editorText);
    });
  });
  return deleteConsole;
};
function colorConverter(input: string, cb: Function) {
  if (typeof input === "string" && input.startsWith("#")) {
    // HEX to RGB
    const hex = input.replace("#", "");
    if (hex.length !== 3 && hex.length !== 6) {
      cb("Invalid HEX format");
      return input;
    }

    const fullHex = hex.length === 3
      ? hex.split("").map((char) => char + char).join("")
      : hex;

    const rgb = {
      r: parseInt(fullHex.substring(0, 2), 16),
      g: parseInt(fullHex.substring(2, 4), 16),
      b: parseInt(fullHex.substring(4, 6), 16)
    };

    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  } else if (typeof input === "string" && input.startsWith("rgb")) {
    // RGB to HEX
    const match = input.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) {
      cb("Invalid RGB format");
      return input;
    }

    const [_, r, g, b] = match.map(Number);
    if ([r, g, b].some((value) => value < 0 || value > 255)) {
      cb("RGB values must be between 0 and 255");
    }

    const hex = [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("");

    return `#${hex}`;
  } else {
    cb("Invalid input format. Provide HEX or RGB string.");
    return input;
  }
}