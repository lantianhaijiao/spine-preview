/*
 * @Author: wangpan pan.wang@ushow.media
 * @Date: 2025-04-08 19:27:54
 * @LastEditors: wangpan pan.wang@ushow.media
 * @LastEditTime: 2025-04-08 22:34:57
 * @FilePath: /spine-preview/src/utils/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
// __filename
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// 生成临时文件夹/文件
export function createTempDir(dirname: string) {
  // const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), dirname));
  const tempDir = fs.mkdirSync(path.join(os.tmpdir(), dirname));
  return tempDir;
}
export function rmDir(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }

}
export function copyFile(src: string, dest: string) {
  fs.copyFileSync(src, dest);
}