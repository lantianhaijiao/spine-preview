/*
 * @Author: wangpan pan.wang@ushow.media
 * @Date: 2025-04-09 11:07:32
 * @LastEditors: wangpan pan.wang@ushow.media
 * @LastEditTime: 2025-04-09 14:14:38
 * @FilePath: /spine-preview/src/utils/version.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require('fs');
const path = require('path');

function getSpineJsonVersion(filePath: string): string | null {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const spineData = JSON.parse(data);
    
    // 不同版本 Spine 导出格式可能不同
    return spineData.skeleton?.spine ||  // Spine 3.8+ 格式
           spineData.skeleton?.version || // 更早版本
           '未知版本';
  } catch (err) {
    console.error('读取 Spine JSON 文件失败:', err);
    return null;
  }
}

function getSpineBinaryVersion(filePath: string): string | null {
  try {
    const buffer = fs.readFileSync(filePath);
    // Spine 二进制文件前4字节通常是版本信息
    const version = buffer.readUInt32LE(0);
    return convertSpineVersion(version);
  } catch (err) {
    console.error('读取 Spine 二进制文件失败:', err);
    return null;
  }
}

function convertSpineVersion(versionCode: number): string {
  // 版本号转换逻辑 (根据Spine官方文档)
  const major = (versionCode >> 24) & 0xff;
  const minor = (versionCode >> 16) & 0xff;
  return `${major}.${minor}`;
}

// // 使用示例
// const skelVersion = getSpineBinaryVersion('character.skel');
// console.log('Spine 二进制版本:', skelVersion);

function parseSpineVersion(versionString: string) {
  // 分割版本组成部分
  const parts = versionString.trim().split('-from-');
  
  // 获取最后一个部分作为最新版本
  const latest = parts[parts.length - 1];
  
  return {
    original: versionString,
    components: parts,
    baseVersion: parts[0],
    latestVersion: latest,
    versionNumber: parseFloat(latest),
    isCustom: parts.length > 1 // 标记是否为特殊版本
  };
}

function detectSpineVersion(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.json') {
    return getSpineJsonVersion(filePath);
  } else if (ext === '.skel') {
    return getSpineBinaryVersion(filePath);
  } else {
    throw new Error('不支持的 Spine 文件格式');
  }
}

// 1 v1>v2 0 v1=v2 -1 v1<v2
export function qmCompareVersion(v1: any, v2: any) {
  if (v1 === v2) {return 0;}
  v1 = v1.split('.');
  v2 = v2.split('.');
  var len = Math.max(v1.length, v2.length);
  // 调整两个版本号位数相同
  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  // 循环判断每位数的大小
  for (let i = 0; i < len; i++) {
    var num1 = parseInt(v1[i]);
    var num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

export default function getSpineVersion(filePath: string): any {
  try {
    const versionString = detectSpineVersion(filePath);
    return parseSpineVersion(versionString as string).latestVersion;
  } catch (error) {
    console.error('获取 Spine 版本失败:', error);
    return null;
  }
}